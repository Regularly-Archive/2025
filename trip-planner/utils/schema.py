from pydantic import BaseModel
from typing import List, Optional

# 定义请求体模型
class TripRequest(BaseModel):
    user_input: str 

# 定义响应体模型
class TripPlan(BaseModel):
    itinerary: str
