from jarvis.tools import registry
import datetime
import random
import requests

@registry.register(name="query_time", description="查询当前时间")
def query_time() -> str:
    now = datetime.datetime.now()
    prefix = '上午'
    if 0 <= now.hour < 6:
        prefix = '凌晨'
    elif 6 <= now.hour < 9:
        prefix = '早上'
    elif 9 <= now.hour < 12:
        prefix = '上午'
    elif 12 <= now.hour < 18:
        prefix = '下午'
    elif 18 <= now.hour <= 23:
        prefix = '晚上'
    formated = now.strftime('%H时%M分')
    return f'当前时间是{prefix}{formated}'

@registry.register(name="query_date", description="查询当前日期和历史上的今天")
def query_date() -> str:
    now = datetime.datetime.now()
    week_list = ['星期一','星期二','星期三','星期四','星期五','星期六','星期日']
    formated = now.strftime('%Y年%m月%d日')
    week_day = week_list[now.weekday()]
    history = today_on_history()
    if history:
        return f'今天是{formated}，{week_day}。{history}。'
    else:
        return f'今天是{formated}，{week_day}。'

def today_on_history():
    try:
        response = requests.get('https://www.ipip5.com/today/api.php?type=json')
        payload = response.json()
        event = random.choice(payload['result'])
        event_year = event['year']
        event_date = payload['today']
        event_desc = event['title']
        return f'历史上的今天: {event_year}年{event_date}, {event_desc}'
    except Exception:
        return None 