from .client import LLMClient
from ..config.settings import settings

def get_llm_client():
    return LLMClient(
        api_key=settings.OPENAI_API_KEY,
        api_base=settings.OPENAI_API_ENDPOINT,
        model=settings.LLM_MODEL
    ) 