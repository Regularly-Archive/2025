from jarvis.tools import registry
import requests
from os import environ as env
from xpinyin import Pinyin

@registry.register(name="query_weather", description="查询指定城市的天气信息")
def query_weather(city: str) -> str:
    """
    查询指定城市的天气信息。
    :param city: 城市名称
    :return: 天气描述
    """
    # 这里以和风天气API为例，需配置 QWEATHER_API_KEY 和 QWEATHER_HOST_URL
    api_key = env.get('QWEATHER_API_KEY')
    host = env.get('QWEATHER_HOST_URL', 'devapi.qweather.com')
    pinyin = Pinyin()
    city_code = pinyin.get_pinyin(city, '')
    # 获取城市代码
    url = f"https://geoapi.qweather.com/v2/city/lookup?key={api_key}&location={city_code}"
    resp = requests.get(url)
    data = resp.json()
    if data.get('code') == '200' and data.get('location'):
        location = data['location'][0]
        location_id = location['id']
        # 获取天气
        url = f"https://{host}/v7/weather/now?key={api_key}&location={location_id}"
        resp = requests.get(url)
        weather = resp.json()
        if weather.get('code') == '200':
            now = weather['now']
            return f"{city}当前气温{now['temp']}℃，{now['text']}，{now['windDir']}{now['windScale']}级，湿度{now['humidity']}%"
    return f"未能获取{city}的天气信息" 