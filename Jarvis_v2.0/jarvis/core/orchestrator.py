import json
from jarvis.config.settings import settings
from jarvis.wakeword import PicovoiceWakeWord
from jarvis.asr import BaiduASR, PaddleSpeechASR, WhisperASR, SherpaASR
from jarvis.tts import BaiduTTS, Pyttsx3TTS, PaddleSpeechTTS, EdgeTTS
from jarvis.llm import get_llm_client
from jarvis.tools import registry
from jarvis.actions import trigger
from jarvis.audio import AudioPlayer
from jarvis.config.constants import TTSEngineProvider, ASREngineProvider
import importlib

class Orchestrator:
    def __init__(self):
        self.audio_player = AudioPlayer()
        self.tts = EdgeTTS()  # 可根据配置切换
        self.llm = get_llm_client()
        self.asr = self._init_asr()
        self.wakeword = PicovoiceWakeWord(settings.PICOVOICE_API_KEY, 'Jarvis_en_windows_v2_1_0.ppn')

    def _init_asr(self):
        if settings.ASR_ENGINE == 'baidu':
            return BaiduASR(settings.BAIDU_APP_ID, settings.BAIDU_API_KEY, settings.BAIDU_SECRET_KEY)
        elif settings.ASR_ENGINE == 'paddlespeech':
            return PaddleSpeechASR()
        elif settings.ASR_ENGINE == 'whisper':
            return WhisperASR()
        elif settings.ASR_ENGINE == 'sherpa':
            return SherpaASR(settings.SHERPA_MODEL_PATH)
        else:
            return WhisperASR()

    def run(self):
        print('Jarvis 已启动，等待唤醒...')
        while True:
            # 1. 唤醒检测
            idx = self.wakeword.detect()
            if idx is not None and idx >= 0:
                print('唤醒成功，准备识别...')
                # 2. 降低/暂停音频播放器
                if self.audio_player.is_playing:
                    self.audio_player.set_volume(0.1)
                # 3. 语音识别
                text = self.asr.recognize(keep_audio_file=True)
                print(f'识别到内容: {text}')
                if not text:
                    self.tts.speak('抱歉，我没有听清，请再说一遍')
                    continue
                # 4. LLM function calling 识别意图
                messages = [
                    {"role": "user", "content": text}
                ]
                functions = registry.to_openai_functions()
                response = self.llm.chat(messages, functions=functions, function_call="auto")
                # 5. 解析 function_call
                message = response.choices[0].message
                if hasattr(message, 'function_call') and message.function_call:
                    func_name = message.function_call.name
                    func_args = json.loads(message.function_call.arguments)
                    result = trigger.trigger(func_name, func_args)
                else:
                    result = message.content
                # 6. 恢复音频播放器音量
                if self.audio_player.is_playing:
                    self.audio_player.set_volume(1.0)
                # 7. TTS 回复
                self.tts.speak(str(result)) 