from jarvis.tools import registry
import asyncio
from control.xiaomi import MiServiceController

@registry.register(name="control_device", description="通过小爱同学控制家居设备")
def control_device(command: str) -> str:
    """
    通过小爱同学控制家居设备。
    :param command: 控制指令
    :return: 执行结果
    """
    async def run(text):
        controller = MiServiceController()
        result = await controller.execute_text_directive(text)
        return result
    loop = asyncio.get_event_loop()
    result = loop.run_until_complete(run(command))
    return f'指令已下发，返回：{result}' 