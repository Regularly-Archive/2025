import json
from typing import List, Optional
from openai import OpenAI
import os
from repositories.attraction_repository import AttractionRepository
from utils.text_processing import tokenize_user_input

class TripService:
    def __init__(self):
        self.repository = AttractionRepository()
        self.client = OpenAI(
            api_key=os.environ.get("OPENAI_API_KEY"),
            base_url='https://api.deepseek.com'
        )
        self.tools = [{
            "type": "function",
            "function": {
                "name": "search_attractions",
                "description": "根据省份、城市和标签查询景点。用户需要提供省份、城市或标签中的至少一个。",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "province": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            },
                            "description": "一个或者多个省份名称列表，例如: ['陕西省', '宁夏回族自治区']"
                        },
                        "city": {
                            "type": "string", 
                            "items": {
                                "type": "string"
                            },
                            "description": "一个或者多个城市名称列表，例如: ['西安']"
                        },
                        "tags": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            },
                            "description": "标签列表，例如: ['历史', '文化']。"
                        },
                        "days": {
                            "type": "integer",
                            "description":"计划旅行的天数，正整数，默认为3天"
                        }
                    },
                    "required": []
                }
            }
        }]

    def handle_function_call(self, function_name: str, arguments: str, user_input: str) -> str:
        if function_name == "search_attractions":
            args = json.loads(arguments)
            province = args.get("province") or []
            city = args.get("city") or []
            ai_tags = args.get("tags") or []
            manual_tags = tokenize_user_input(user_input)

            tags = []
            if ai_tags:
                tags.extend(ai_tags)

            if manual_tags:
                tags.extend(manual_tags)

            attractions = self.repository.search_attractions(province, city, tags)
            return json.dumps(attractions, ensure_ascii=False)
        else:
            raise ValueError(f"未知的函数: {function_name}")

    def generate_itinerary(self, attractions: str, days: int) -> str:
        attractions = json.loads(attractions)
        filtered_attractions = filter(lambda x:x['payment_level'] > 0, attractions)

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

        response = self.client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": "你是一个专业的旅行规划师."},
                {"role": "user", "content": prompt}
            ],
            stream=False
        )

        itinerary = response.choices[0].message.content.strip()
        return itinerary

    def extract_intent(self, user_input: str) -> str:
        response = self.client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": "你是一个专业的旅行规划师。"},
                {"role": "user", "content": user_input}
            ],
            tools=self.tools,
            tool_choice="auto"
        )

        response_message = response.choices[0].message
        if response_message.tool_calls != None and len(response_message.tool_calls) > 0:
            tool_call = response_message.tool_calls[0]
            function_name = tool_call.function.name
            arguments = tool_call.function.arguments

            attractions = self.handle_function_call(function_name, arguments, user_input)
            if len(json.loads(attractions)) == 0:
                return '无符合要求的景点，暂时无法为您规划行程，请稍后重试'
            
            args = json.loads(arguments)
            days = args.get("days") or 3

            if len(json.loads(attractions)) < 2 * days:
                return '景点数目不足，暂时无法为您规划行程，请稍后重试'
            
            return self.generate_itinerary(attractions, days)
        else:
            return response_message.content.strip()
