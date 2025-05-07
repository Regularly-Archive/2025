from typing import Callable, Dict, Any, List, Optional
import inspect

class Tool:
    def __init__(self, name: str, description: str, func: Callable, parameters: Optional[Dict[str, Any]] = None):
        self.name = name
        self.description = description
        self.func = func
        self.parameters = parameters or self._infer_parameters()

    def _infer_parameters(self) -> Dict[str, Any]:
        sig = inspect.signature(self.func)
        return {k: str(v.annotation) for k, v in sig.parameters.items()}

    def call(self, **kwargs):
        return self.func(**kwargs)

    def to_openai_function(self) -> Dict[str, Any]:
        """
        转换为 OpenAI function calling 所需的 function schema。
        """
        return {
            "name": self.name,
            "description": self.description,
            "parameters": {
                "type": "object",
                "properties": {k: {"type": "string"} for k in self.parameters.keys()},
                "required": list(self.parameters.keys())
            }
        }

class ToolRegistry:
    def __init__(self):
        self._tools: Dict[str, Tool] = {}

    def register(self, name: str, description: str):
        def decorator(func):
            tool = Tool(name, description, func)
            self._tools[name] = tool
            return func
        return decorator

    def get(self, name: str) -> Optional[Tool]:
        return self._tools.get(name)

    def all(self) -> List[Tool]:
        return list(self._tools.values())

    def to_openai_functions(self) -> List[Dict[str, Any]]:
        return [tool.to_openai_function() for tool in self._tools.values()]

# 全局工具注册表
registry = ToolRegistry() 