from typing import Dict, List, Optional
from langchain.chat_models import ChatOpenAI
from langchain.tools import BaseTool
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from pydantic import BaseModel
from enum import Enum
import json, time

# 定义工具接口基类
class ToolInterface(BaseModel):
    name: str
    description: str
    parameters: Dict[str, str]
    required_context: List[str] = []
    
    def validate_params(self, params: Dict) -> bool:
        return all(k in params for k in self.parameters)

# 定义工具状态
class ToolStatus(str, Enum):
    READY = "ready"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"

# 定义推理步骤
class ReasoningStep(BaseModel):
    step_id: int
    description: str
    requires_tool: bool = False
    tool_name: Optional[str] = None
    tool_params: Optional[Dict] = None
    result: Optional[str] = None
    status: str = "pending",
    continue_flag: bool = False

# 实现具体工具示例
class SearchTool(BaseTool):
    name: str = "search"
    description: str  = "用于搜索信息的工具"
    
    def _run(self, query: str) -> str:
        # 实际搜索逻辑
        return f"搜索结果: 关于{query}的信息..."
    
    async def _arun(self, query: str) -> str:
        # 异步实现
        return self._run(query)

class CalculatorTool(BaseTool):
    name: str  = "calculator"
    description: str  = "用于数学计算的工具"
    
    def _run(self, expression: str) -> str:
        try:
            return str(eval(expression))
        except:
            return "计算错误"
    
    async def _arun(self, expression: str) -> str:
        return self._run(expression)

# 主要的推理引擎类
class StructuredReasoning:
    def __init__(self, llm, tools: List[BaseTool]):
        self.llm = llm
        self.tools = {tool.name: tool for tool in tools}
        self.tools_schema = [tool.tool_call_schema.model_json_schema() for tool in tools]
        self.context = []
        self.reasoning_steps = []
        self.step_counter = 0,
        self.max_steps = 5
        
        # 定义推理步骤生成器
        self.step_generator = LLMChain(
            llm=llm,
            prompt=PromptTemplate(
                input_variables=["context", "question", "tools_schema"],
                template="""
                基于以下上下文和问题，生成下一个推理步骤：
                
                当前上下文：{context}
                当前问题：{question}
                可用工具: {tools_schema}
                
                请按下列步骤进行推理：
                1. 描述这一步要做什么
                2. 是否需要使用工具 (是/否)
                3. 如果需要工具，指定工具名称和参数
                4. 如果不需要工具，请结合上下文告诉我，结果是什么?
                5. 如果可以在上下文中找到答案，请直接在result返回答案，并设置continue为false
                6. 如果不能，请设置continue为true
                7. 确保推理返回值是一个合法的 JSON

                推理返回值示例：
                {{
                    "description": "描述这一步要做什么",
                    "requires_tool": true,
                    "tool_name": "",
                    "tool_params": {{}},
                    "result": "",
                    "continue": true
                }}
                """
            )
        )
    
    def add_step(self, description: str, requires_tool: bool = False, 
                 tool_name: Optional[str] = None, tool_params: Optional[Dict] = None, continue_flag: bool = False) -> ReasoningStep:
        self.step_counter += 1
        step = ReasoningStep(
            step_id=self.step_counter,
            description=description,
            requires_tool=requires_tool,
            tool_name=tool_name,
            tool_params=tool_params,
            continue_flag=continue_flag
        )
        self.reasoning_steps.append(step)
        return step
    
    def execute_tool(self, step: ReasoningStep) -> str:
        if not step.requires_tool or not step.tool_name:
            return None
            
        tool = self.tools.get(step.tool_name)
        if not tool:
            return f"Error: Tool {step.tool_name} not found"
            
        try:
            result = tool._run(**step.tool_params)
            step.status = "completed"
            step.result = result
            return result
        except Exception as e:
            step.status = "failed"
            return f"Error: {str(e)}"
    
    def update_context(self, step: ReasoningStep):
            self.context.append({'reasoning_content': step.description, 'answer': step.result})
    
    def reason_and_act(self, question: str) -> List[ReasoningStep]:
        while not self._is_reasoning_complete():
            time.sleep(60)

            # 生成下一步推理
            next_step_response = self.step_generator.invoke({
                'context': json.dumps(self.context),
                'question': question,
                'tools_schema': json.dumps(self.tools_schema)
            })
            
            # 解析响应并创建步骤
            # 这里需要实现解析逻辑，简化示例：
            next_step_response = next_step_response['text'].replace('\n', '')
            next_step_response = json.loads(next_step_response)
            requires_tool = ('requires_tool' in next_step_response) and (next_step_response['requires_tool'] == True)
            tool_name = None
            tool_params = None
            
            if requires_tool:
                # 解析工具名称和参数
                # 简化示例
                tool_name = next_step_response['tool_name']
                tool_params = next_step_response['tool_params']
            
            step = self.add_step(
                description=next_step_response['description'],
                requires_tool=requires_tool,
                tool_name=tool_name,
                tool_params=tool_params,
                continue_flag=next_step_response['continue']
            )
            
            # 如果需要工具，执行工具调用
            if step.requires_tool:
                self.execute_tool(step)
            else:
                step.status = "completed"
                step.result = next_step_response['result']
                
            self.update_context(step)
            
        return self.reasoning_steps
    
    def _is_reasoning_complete(self) -> bool:
        
        if len(self.reasoning_steps) == 0:
            return False
        if len(self.reasoning_steps) >= self.max_steps:
            return True
        if self.reasoning_steps[-1].continue_flag == False:
            return True

# 使用示例
def main():
    # 初始化 LLM
    llm = ChatOpenAI(
        model='moonshot-v1-8k',
        temperature=0, 
        api_key='sk-APWVOCSURpKfRXlTbFeaKvBdjvk2U1Liah2kS3FSCLDSwkYS', 
        base_url='https://api.moonshot.cn/v1',
    )
    
    # 初始化工具
    tools = [SearchTool(), CalculatorTool()]
    
    # 创建推理引擎
    reasoning_engine = StructuredReasoning(llm, tools)
    
    # 测试问题
    question = "如果我有100元，要分3次投资，每次投资多少？假设每次投资受益为1%，最终受益是多少？"
    
    # 执行推理
    steps = reasoning_engine.reason_and_act(question)
    
    # 打印结果
    for step in steps:
        print(f"\nStep {step.step_id}:")
        print(f"Description: {step.description}")
        if step.requires_tool:
            print(f"Tool: {step.tool_name}")
        if step.result:
            print(f"Result: {step.result}")
        print(f"Status: {step.status}")

    

if __name__ == "__main__":
    main()