import random
from enum import IntEnum

welcome_tips = [
    'Welcome home, sir.',
    "For you, sir, always",
    'Always at your service, sir',
    "Allow me to introduce myself. I'm JARVIS, a virtual artificial intelligence, and I'm here to assist you with a variety of tasks as best as I can. 24 hours a day, seven days a week. Importing all preferences from home interface. Begin systems check."
]

def welcome():
    return random.choice(welcome_tips)

# 事件/状态定义
class JarvisEventType(IntEnum):
    Greet = 0
    Awake = 1
    InputFailed = 2
    Inputed = 3
    OutputFailed = 4
    Outputed = 5
    Idle = 6

# TTS 引擎类型
class TTSEngineProvider(IntEnum):
    Baidu = 0
    Pyttsx3 = 1
    PaddleSpeech = 2
    Edge = 3

# ASR 引擎类型
class ASREngineProvider(IntEnum):
    Baidu = 0
    PaddleSpeech = 1
    OpenAIWhisper = 2
    Sherpa = 3

# 意图提取器类型
class IntentExtractorProvider(IntEnum):
    OpenAI = 0
    Rasa = 1 