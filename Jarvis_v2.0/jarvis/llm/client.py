import openai
from typing import Any, Dict, List, Optional
from ..config.settings import settings

class LLMClient:
    def __init__(self, api_key: str = None, api_base: str = None, model: str = None):
        self.api_key = api_key or settings.OPENAI_API_KEY
        self.api_base = api_base or settings.OPENAI_API_ENDPOINT
        self.model = model or settings.LLM_MODEL
        openai.api_key = self.api_key
        openai.base_url = self.api_base

    def chat(self, messages: List[Dict[str, str]], functions: Optional[List[Dict[str, Any]]] = None, function_call: Optional[str] = None, **kwargs) -> Any:
        return openai.chat.completions.create(
            model=self.model,
            messages=messages,
            functions=functions,
            function_call=function_call,
            **kwargs
        ) 