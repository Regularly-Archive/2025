from jarvis.tools import registry
import webbrowser

@registry.register(name="search_info", description="在浏览器中检索指定内容")
def search_info(query: str) -> str:
    """
    在浏览器中检索指定内容。
    :param query: 检索内容
    :return: 检索提示
    """
    webbrowser.open(f'https://bing.com/search?q={query}')
    return f'已为您检索到关于{query}的内容，请在浏览器中查看。' 