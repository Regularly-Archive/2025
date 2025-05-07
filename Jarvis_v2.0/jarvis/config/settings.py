import os
from dotenv import load_dotenv, find_dotenv

class Settings:
    def __init__(self, env_file=None):
        if env_file is None:
            env_file = '.env'
        load_dotenv(find_dotenv(env_file))
        self.BAIDU_APP_ID = os.getenv('BAIDU_APP_ID')
        self.BAIDU_API_KEY = os.getenv('BAIDU_API_KEY')
        self.BAIDU_SECRET_KEY = os.getenv('BAIDU_SECRET_KEY')
        self.PICOVOICE_API_KEY = os.getenv('PICOVOICE_API_KEY')
        self.OPENAI_API_ENDPOINT = os.getenv('OPENAI_API_ENDPOINT')
        self.OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
        self.OPENAI_API_PROMPT = os.getenv('OPENAI_API_PROMPT')
        self.PLAY_WELCOME_VOICE = os.getenv('PLAY_WELCOME_VOICE', 'False').lower() == 'true'
        self.ENABLE_CHINESE_CORRECT = os.getenv('ENABLE_CHINESE_CORRECT', 'False').lower() == 'true'
        self.ENABLE_SEMANTIC_ANALYSIS = os.getenv('ENABLE_SEMANTIC_ANALYSIS', 'False').lower() == 'true'
        self.OPENWEATHERMAP_API_KEY = os.getenv('OPENWEATHERMAP_API_KEY')
        self.RASA_NLU_ENDPOINT = os.getenv('RASA_NLU_ENDPOINT')
        self.SHERPA_MODEL_PATH = os.getenv('SHERPA_MODEL_PATH')
        self.LLM_PROVIDER = os.getenv('LLM_PROVIDER', 'openai')
        self.LLM_MODEL = os.getenv('LLM_MODEL', 'gpt-3.5-turbo')
        self.DEEPSEEK_API_KEY = os.getenv('DEEPSEEK_API_KEY')
        self.DEEPSEEK_API_ENDPOINT = os.getenv('DEEPSEEK_API_ENDPOINT')

settings = Settings() 