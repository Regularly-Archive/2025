import jieba.posseg as pseg
from typing import List

def tokenize_user_input(user_input: str) -> List[str]:
    words = pseg.lcut(user_input)
    nouns = [word for word, flag in words if flag in ['n', 'ns', 'nr', 'nt', 'nz']]
    return nouns
