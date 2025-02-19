from langchain_community.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.tools import BaseTool, tool
from typing import Dict, List, Optional
from langchain.chains import LLMChain
from schema import StepStatus, ReasoningStep
from config import REASONING_PROMPT_TEMPLATE
import time, json

class StructuredReasoning:
    def __init__(self, llm, tools: List[BaseTool], max_steps: int = 5):
        self.llm = llm
        self.tools = {tool.name: tool for tool in tools}
        self.tools_schema = [tool.tool_call_schema.model_json_schema() for tool in tools]
        self.reasoning_steps = []
        self.step_count = 0,
        self.max_steps = max_steps
        
        self.step_generator = LLMChain(
            llm=llm,
            prompt=PromptTemplate(
                input_variables=["context", "question", "tools_schema"],
                template=REASONING_PROMPT_TEMPLATE 
            )
        )
    
    def add_step(self, args: dict) -> ReasoningStep:
        if isinstance(self.step_count, tuple):
            self.step_count = self.step_count[-1]

        self.step_count += 1
        step = ReasoningStep(
            step_id=self.step_count,
            reasoning=args['reasoning'],
            requires_tool=args['requires_tool'],
            tool_name=args['tool_name'],
            tool_params=args['tool_params'],
            continue_=args['continue'],
            confidence=args['confidence']
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
            step.status = StepStatus.COMPLETED
            step.result = result
        except Exception as e:
            step.status = StepStatus.FAILED
            step.result = str(e)
    
    def reason_and_act(self, question: str) -> List[ReasoningStep]:
        while not self._is_reasoning_complete():
            time.sleep(60)

            next_step_response = self.step_generator.invoke({
                'context': json.dumps([step.model_dump() for step in self.reasoning_steps]),
                'question': question,
                'tools_schema': json.dumps(self.tools_schema)
            })
            
            next_step_response = next_step_response['text'].replace('```json', '').replace('```', '').replace('\n', '')
            next_step_response = json.loads(next_step_response)
            requires_tool = ('requires_tool' in next_step_response) and (next_step_response['requires_tool'] == True)
            tool_name = None
            tool_params = None
            
            if requires_tool:
                tool_usage = next_step_response['tool_usage']
                tool_name = tool_usage['name']
                tool_params = tool_usage['params']
            
            step = self.add_step({
                'reasoning': next_step_response['reasoning'],
                'requires_tool': requires_tool,
                'tool_name': tool_name,
                'tool_params': tool_params,
                'continue': next_step_response['continue'],
                'confidence': next_step_response['confidence']
            })
            
            if step.requires_tool:
                self.execute_tool(step)
            else:
                step.status = StepStatus.COMPLETED
                step.result = next_step_response['result']
            
        return self.reasoning_steps, self.reasoning_steps[-1].result
    
    def _is_reasoning_complete(self) -> bool:
        if len(self.reasoning_steps) == 0:
            return False
        if len(self.reasoning_steps) >= self.max_steps:
            return True
        if self.reasoning_steps[-1].continue_ == False:
            return True

    def reset(self):
        self.reasoning_steps = []
        self.step_count = 0
