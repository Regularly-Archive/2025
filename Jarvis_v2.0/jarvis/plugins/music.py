from jarvis.tools import registry
import requests
import os
from pathlib import Path
from speech import async_playsound  # 需后续适配到 v2.0 audio

session = requests.Session()
session.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0'
download_folder = os.path.join(Path.home(), 'download')

@registry.register(name="search_music", description="搜索并播放指定歌曲")
def search_music(song: str) -> str:
    """
    搜索并播放指定歌曲。
    :param song: 歌曲名
    :return: 播放结果
    """
    try:
        response = session.get(f'http://music.163.com/api/search/get/web?csrf_token=hlpretag=&hlposttag=&s={song}&type=1&offset=0&total=true&limit=2')
        response.raise_for_status()
        payload = response.json()
        if payload['code'] == 200 and len(payload['result']['songs']) > 0:
            song_id = payload['result']['songs'][0]['id']
            song_name = payload['result']['songs'][0]['name']
            song_artist = payload['result']['songs'][0]['artists'][0]['name']
            response = session.get(f'http://music.163.com/song/media/outer/url?id={song_id}',allow_redirects=False)
            if response.status_code == 302:
                musicUrl = response.headers['Location']
                if musicUrl == 'http://music.163.com/404':
                    return '抱歉，没有为您找到相关歌曲'
                response = session.get(musicUrl)
                if not os.path.exists(download_folder):
                    os.mkdir(download_folder)
                musicFile = os.path.join(download_folder, f'{song_id}.mp3')
                with open(musicFile, 'wb')as fp:
                    fp.write(response.content)
                # 这里调用 v2.0 的 AudioPlayer 播放
                # from jarvis.audio import AudioPlayer
                # AudioPlayer().play(musicFile)
                return f'已为您找到{song_artist}的《{song_name}》, 正在播放...'
        else:
            return '抱歉，没有为您找到相关歌曲'
    except Exception as e:
        return '抱歉，没有为您找到相关歌曲' 