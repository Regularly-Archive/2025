# Jarvis v2.0

下一代语音助手，支持多模型、多工具调用、插件化扩展。

## 主要特性
- 支持多种语音识别（ASR）和语音合成（TTS）引擎
- 支持 OpenAI、DeepSeek 等大模型，function calling 工具调用
- 插件化架构，易于扩展天气、音乐、家居等能力
- 统一配置管理，支持多环境
- CLI/Web 多入口

## 目录结构
```
jarvis/
  core/         # 核心流程与协议
  config/       # 配置与常量
  wakeword/     # 唤醒词
  asr/          # 语音识别
  tts/          # 语音合成
  audio/        # 音频播放
  llm/          # 大模型与意图理解
  tools/        # function calling 工具协议
  plugins/      # 插件
  actions/      # ActionTrigger 路由
cli.py          # CLI 入口
web.py          # Web 入口（可选）
```

## 快速开始
1. 安装依赖：`poetry install` 或 `pip install -r requirements.txt`
2. 配置环境变量：复制 `.env.example` 为 `.env` 并填写
3. 运行 CLI 版本：`python cli.py` 