from typing import Dict, Any
from jarvis.tools import registry

class ActionTrigger:
    def __init__(self, tool_registry=registry):
        self.tool_registry = tool_registry

    def trigger(self, intent_name: str, params: Dict[str, Any]) -> Any:
        tool = self.tool_registry.get(intent_name)
        if tool:
            try:
                return tool.call(**params)
            except Exception as e:
                return f"工具调用失败: {e}"
        else:
            return f"未找到对应工具：{intent_name}"

# 全局 ActionTrigger 实例
trigger = ActionTrigger() 