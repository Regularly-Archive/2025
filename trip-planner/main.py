from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from openai import OpenAI
import os
import psycopg2
import json
import jieba.posseg as pseg
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

# 初始化 OpenAI API
client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"), 
    base_url='https://api.deepseek.com'
)

# 初始化 FastAPI
app = FastAPI()

# 定义请求体模型
class TripRequest(BaseModel):
    user_input: str  # 用户输入的自然语句

# 定义响应体模型
class TripPlan(BaseModel):
    itinerary: str

# 定义工具
tools = [
    {
        "type": "function",
        "function": {
            "name": "search_attractions",
            "description": "根据省份、城市和标签查询景点。用户需要提供省份、城市或标签中的至少一个。",
            "parameters": {
                "type": "object",
                "properties": {
                    "province": {
                        "type": "string",
                        "description": "省份名称，例如 '陕西省'，'宁夏回族自治区'等。"
                    },
                    "city": {
                        "type": "string",
                        "description": "城市名称，例如 '西安'。"
                    },
                    "tags": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        },
                        "description": "标签列表，例如 ['历史', '文化']。"
                    },
                    "days": {
                        "type": "integer",
                        "description":"计划旅行的天数，正整数，默认为3天"
                    }

                },
                "required": [] 
            }
        }
    }
]

# 连接 PostgreSQL 数据库
def get_db_connection():
    conn = psycopg2.connect(
        host=os.getenv("POSTGRES_HOST"),
        port=os.getenv("POSTGRES_PORT"),
        dbname=os.getenv("POSTGRES_DB"),
        user=os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD")
    )
    return conn

# 使用结巴分词对用户输入进行分词
def tokenize_user_input(user_input: str) -> List[str]:
    words = pseg.lcut(user_input)
    nouns = [word for word, flag in words if flag in ['n', 'ns', 'nr', 'nt', 'nz']]
    return nouns

# 从数据库中检索景点
def search_attractions(province: Optional[str] = None, city: Optional[str] = None, tags: Optional[List[str]] = None) -> List[dict]:
    conn = get_db_connection()
    cur = conn.cursor()

    # 构建查询条件
    conditions = []
    params = []

    if province:
        conditions.append("province = %s")
        params.append(province)
    if city:
        conditions.append("city = %s")
        params.append(city)
    if tags:
        conditions.append("tags && %s")
        params.append(tags)

    # 构建查询语句
    query = """
        SELECT name, description, province, city, tags,  payment_level FROM attractions
    """
    if conditions:
        query += " WHERE " + " AND ".join(conditions)
    query += " ORDER BY payment_level DESC;"

    # 执行查询
    cur.execute(query, params)
    results = cur.fetchall()

    # 格式化结果
    attractions = []
    for row in results:
        attractions.append({
            "name": row[0],
            "description": row[1],
            "province": row[2],
            "city": row[3],
            "tags": row[4],
            "payment_level": row[5]
        })

    cur.close()
    conn.close()
    return attractions

# 处理 Function Calling
def handle_function_call(function_name, arguments, user_input):
    if function_name == "search_attractions":
        # 解析参数
        args = json.loads(arguments)
        province = args.get("province")
        city = args.get("city")
        ai_tags = args.get("tags")
        manual_tags = tokenize_user_input(user_input)

        tags = []
        tags.extend(ai_tags)
        tags.extend(manual_tags)

        # 调用查询函数
        attractions = search_attractions(province, city, tags)
        return json.dumps(attractions, ensure_ascii=False)
    else:
        raise ValueError(f"未知的函数: {function_name}")
    
# 生成行程计划
def generate_itinerary(attractions, days: int) -> str:
    attractions = json.loads(attractions)
    filtered_attractions = filter(lambda x:x['payment_level'] > 0, attractions)

    # 构造提示词
    prompt = f"""规划一个为期 {days} 天的行程，需考虑以下因素:
        
        推荐景点（应优先考虑）：
        {json.dumps([s['name'] for s in filtered_attractions], ensure_ascii=False)}
        
        所有可用景点:
        {json.dumps(attractions, ensure_ascii=False)}
        
       要求：
        * 优先将高支付等级的景点安排在黄金时间段。
        * 确保推荐景点得到适当的曝光。
        * 创建一个平衡且合理的路线。
        * 考虑景点之间的交通时间。
        * 每天至少两个景点, 最多不超过四个景点
        """

    # 调用 OpenAI API
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "system", "content": "你是一个专业的旅行规划师."},
            {"role": "user", "content": prompt}
        ],
        stream=False
    )

    # 提取生成的行程计划
    itinerary = response.choices[0].message.content.strip()
    return itinerary

# 提取意图
def extract_intent(user_input: str) -> str:
    # 启用 Function Calling
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "system", "content": "你是一个专业的旅行规划师。"},
            {"role": "user", "content": user_input}
        ],
        tools=tools,
        tool_choice="auto"
    )


    response_message = response.choices[0].message
    if response_message.tool_calls != None and len(response_message.tool_calls) > 0:
        # 提取函数调用信息
        tool_call = response_message.tool_calls[0]
        function_name = tool_call.function.name
        arguments = tool_call.function.arguments

        # 调用函数并获取结果
        attractions = handle_function_call(function_name, arguments, user_input)
        if len(json.loads(attractions)) == 0:
            return '无符合要求的景点，暂时无法为您规划行程，请稍后重试'
        
        # 将函数调用结果返回给模型
        args = json.loads(arguments)
        days = args.get("days")
        if days == None:
            days = 3
        else:
            days = int(days)

        if len(json.loads(attractions)) < 2 * days:
            return '景点数目不足，暂时无法为您规划行程，请稍后重试'
        
        # 生成计划
        return generate_itinerary(attractions, days)
    else:
        # 直接返回模型的回复
        return response_message.content.strip()

# 定义 API 接口
@app.post("/generate-plan", response_model=TripPlan)
async def generate_plan(request: TripRequest):
    try:
        # 生成行程计划
        itinerary = extract_intent(request.user_input)
        return {"itinerary": itinerary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 运行服务
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)