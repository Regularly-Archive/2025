from typing import Dict, List, Optional, Union
from pydantic import BaseModel
from enum import Enum

class StepStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"

class ReasoningStep(BaseModel):
    step_id: int
    reasoning: str
    requires_tool: bool = False
    tool_name: Optional[str] = None
    tool_params: Optional[Dict] = None
    result: Optional[Union[str, dict]] = None
    status: StepStatus = StepStatus.PENDING,
    continue_: bool = False,
    confidence: int