import uvicorn
import sys
from pathlib import Path

# 将项目根目录添加到 Python 路径
root_path = str(Path(__file__).parent)
if root_path not in sys.path:
    sys.path.append(root_path)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)