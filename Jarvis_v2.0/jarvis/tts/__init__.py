from typing import Optional
import importlib
import os
from pathlib import Path
import time
import asyncio

class TTSEngine:
    def speak(self, text: str, **kwargs) -> None:
        raise NotImplementedError

class BaiduTTS(TTSEngine):
    def __init__(self, app_id, api_key, secret_key):
        aip = importlib.import_module('aip')
        self.client = aip.AipSpeech(app_id, api_key, secret_key)

    def speak(self, text: str = "", speed: int = 5, volume: int = 5, person: int = 3):
        result = self.client.synthesis(text, 'zh', 1, {
            'spd': speed,
            'vol': volume,
            'per': person
        })
        filePath = os.path.join(Path.home(), "audio.mp3")
        if not isinstance(result, dict):
            with open(filePath, "wb") as f:
                f.write(result)
            self._play(filePath)
        else:
            print("语音合成失败", result)

    def _play(self, filePath):
        import threading
        from playsound import playsound
        t = threading.Thread(target=playsound, args=(filePath,))
        t.start()

class Pyttsx3TTS(TTSEngine):
    def __init__(self):
        pyttsx3 = importlib.import_module('pyttsx3')
        self.engine = pyttsx3.init()

    def speak(self, text: str = "", speed: int = 100, volume: float = 0.6, person: int = 0):
        self.engine.setProperty('rate', speed)
        self.engine.setProperty('volume', volume)
        voices = self.engine.getProperty('voices')
        if person > len(voices) - 1:
            person = 0
        self.engine.setProperty('voice', voices[person].id)
        self.engine.say(text)
        self.engine.runAndWait()

class PaddleSpeechTTS(TTSEngine):
    def __init__(self):
        paddlespeech = importlib.import_module('paddlespeech.cli.tts.infer')
        self.executor = paddlespeech.TTSExecutor()

    def speak(self, text: str = "", lang: str = 'mix', model: str = 'fastspeech2_male'):
        filePath = os.path.join(Path.home(), "output.mp3")
        self.executor(text=text, output=filePath, am=model, lang=lang)
        self._play(filePath)

    def _play(self, filePath):
        import threading
        from playsound import playsound
        t = threading.Thread(target=playsound, args=(filePath,))
        t.start()

class EdgeTTS(TTSEngine):
    def __init__(self):
        self.edge_tts = importlib.import_module('edge_tts')

    def speak(self, text: str = "", lang: str = 'zh-CN', voice: Optional[str] = None):
        loop = asyncio.get_event_loop()
        voices = loop.run_until_complete(self.edge_tts.VoicesManager.create())
        if voice is None:
            voice_list = voices.find(Gender="Male", Locale=lang)
            if not voice_list:
                voice_list = voices.find(Gender="Male", Locale='zh-CN')
            voice = voice_list[0]["Name"]
        communicate = self.edge_tts.Communicate(text, voice, rate="-5%", volume="+10%")
        timestamp = time.strftime('%Y%m%d%H%M%S', time.localtime(time.time()))
        filePath = os.path.join(Path.home(), f"record_{timestamp}.mp3")
        loop.run_until_complete(communicate.save(filePath))
        self._play(filePath)

    def _play(self, filePath):
        import threading
        from playsound import playsound
        t = threading.Thread(target=playsound, args=(filePath,))
        t.start() 