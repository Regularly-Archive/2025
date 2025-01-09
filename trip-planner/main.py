from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv
from services.trip_service import TripService
from utils.schema import TripRequest, TripPlan

# 加载环境变量
load_dotenv()

# 初始化 FastAPI
app = FastAPI()
tripService = TripService()



# 定义 API 接口
@app.post("/generate-plan", response_model=TripPlan)
async def generate_plan(request: TripRequest):
    try:
        # 生成行程计划
        itinerary = tripService.extract_intent(request.user_input)
        return {"itinerary": itinerary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 运行服务
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)