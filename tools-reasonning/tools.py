from langchain.tools import BaseTool, tool
from typing import Dict, List, Optional, Union
from urllib.parse import quote
import json, requests
from pydantic import BaseModel

# 定义工具接口基类
class ToolInterface(BaseModel):
    name: str
    description: str
    parameters: Dict[str, str]
    required_context: List[str] = []
    
    def validate_params(self, params: Dict) -> bool:
        return all(k in params for k in self.parameters)

class SearchTool(BaseTool):
    name: str = "search"
    description: str  = "一个用于搜索信息的工具"
    
    def _run(self, query: str) -> str:
        url = f'https://s.jina.ai/{query}?count=10'
        headers = {
            'Accept': 'application/json',
            'Authorization': 'Bearer jina_b03dd1925f1d487d8234378058adda25ifzhwY0A13F5Wme8HNafGLdeQtF9',
            'X-Engine': 'direct',
            'X-Retain-Images': 'none',
            'X-Return-Format': 'markdown'
        }

        response = requests.get(url, headers=headers)
        response = json.loads(response.text)
        if response['code'] != 200:
            return []
        original_data = response['data']
        simplified_data = list(map(lambda x:{'title': x['title'], 'description': x['description']}, original_data ))
        return simplified_data
    
    async def _arun(self, query: str) -> str:
        return self._run(query)

class CalculatorTool(BaseTool):
    name: str  = "calculator"
    description: str  = "一个用于数学计算的工具"
    
    def _run(self, expression: str) -> str:
        try:
            return str(eval(expression))
        except:
            return "计算错误"
    
    async def _arun(self, expression: str) -> str:
        return self._run(expression)

class SumTool(BaseTool):
    name: str = "sum_numbers"
    description: str = "一个用于计算一组数字的总和的工具"
    
    def _run(self, numbers: list[Union[float,int]]) -> float:
        return sum(numbers)
    
    async def _arun(self, numbers: list[Union[float,int]]) -> float:
        return sum(numbers)

class AverageTool(BaseTool):
    name: str = "average_numbers"
    description: str = "一个计算一组数字的平均值的工具"
    
    def _run(self, numbers: list[Union[float,int]]) -> float:
        if not numbers:
            raise ValueError("输入列表不能为空")
        return sum(numbers) / len(numbers)
    
    async def _arun(self, numbers: list[Union[float,int]]) -> float:
        if not numbers:
            raise ValueError("输入列表不能为空")
        return sum(numbers) / len(numbers)


if __name__ == '__main__':
    SearchTool()._run("上海许昕背后击球体育文化发展有限公司 名称由来")