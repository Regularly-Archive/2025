# Trip Planner - 旅游行程规划系统

## 项目简介

Trip Planner 是一个基于 **FastAPI** 和 **OpenAI** 的旅游行程规划系统。用户可以通过自然语言输入旅行需求（如目的地、偏好、天数等），系统会根据用户需求从 **PostgreSQL** 数据库中检索相关景点，并调用 **OpenAI** 生成详细的行程计划。

## 功能特点

1. **自然语言输入**：用户可以用自然语言描述旅行需求，例如 "我想去西安玩3天，喜欢历史和文化，适合亲子游"。
2. **景点检索**：系统根据用户输入的关键词（如省份、城市、标签）从数据库中检索相关景点。
3. **行程生成**：调用 OpenAI 的 GPT 模型，生成详细的行程计划，包括每天的景点、餐饮、交通等安排。
4. **支付等级优先**：优先推荐高支付等级的景点。
5. **Docker 支持**：通过 Docker Compose 一键部署 FastAPI 应用和 PostgreSQL 数据库。

## 技术栈

- **后端框架**: FastAPI
- **数据库**: PostgreSQL
- **AI 模型**: OpenAI GPT-3.5-turbo
- **分词工具**: 结巴分词（jieba）
- **容器化**: Docker + Docker Compose

---

## 使用方法

### 1. 克隆项目

```bash
git clone git@github.com:Regularly-Archive/2025.git
cd trip-planner
```

### 2. 配置环境变量

在项目根目录下创建 `.env` 文件，并填写以下内容：

```
OPENAI_API_KEY=your_openai_api_key_here
```
推荐使用国产大模型：[DeepSeek](https://api-docs.deepseek.com/zh-cn/)

### 3. 启动服务

使用 Docker Compose 启动服务：

```bash
docker-compose up --build
```

服务启动后：
- FastAPI 应用运行在 `http://localhost:8000`。
- PostgreSQL 数据库运行在 `localhost:5433`。

### 4. 测试 API

#### 使用 Swagger UI
1. 打开 `http://localhost:8000/docs`。
2. 找到 `/generate-plan` 接口，点击 "Try it out"。
3. 输入以下测试数据：
   ```json
   {
     "user_input": "我想去陕西省西安市的亲子景点"
   }
   ```
4. 点击 "Execute"，查看生成的行程计划。

#### 使用 `curl` 测试
```bash
curl -X POST "http://localhost:8000/generate-plan" \
-H "Content-Type: application/json" \
-d '{"user_input": "我想去陕西省西安市的亲子景点"}'
```

### 5. 停止服务

停止并删除容器：

```bash
docker-compose down
```

---

## 项目结构

```
trip-planner/
├── main.py               # FastAPI 主程序
├── requirements.txt      # 依赖文件
├── docker-compose.yml        # Docker Compose 配置文件
├── Dockerfile                # FastAPI 应用的 Dockerfile
├── .env                      # 环境变量文件
├── init.sql                  # 初始化 PostgreSQL 数据库的 SQL 脚本
└── README.md                 # 项目说明文件
```

---

## 数据库设计

### 表结构
```sql
CREATE TABLE attractions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,          -- 景点名称
    description TEXT,                    -- 景点描述
    payment_level INT DEFAULT 0,         -- 支付等级 (0: 未支付, 1: 低, 2: 中, 3: 高)
    tags TEXT[],                         -- 标签列表，用于文本检索
    province TEXT,                       -- 省份
    city TEXT                            -- 城市
);
```

### 初始化数据
在 `init.sql` 中预置了一些测试数据，包括陕西和宁夏的景点信息。

---

## 依赖安装

### 手动安装依赖
如果不使用 Docker，可以手动安装依赖：

```bash
pip install -r app/requirements.txt
```

### 依赖列表
- `fastapi`
- `uvicorn`
- `python-dotenv`
- `openai`
- `psycopg2`
- `jieba`

---

## 贡献指南

欢迎提交 Issue 或 Pull Request！如果有任何问题或建议，请随时联系。

---

## 许可证

本项目采用 [MIT 许可证](LICENSE)。

---

## 联系方式

- 邮箱: qinyuanpei@163.com
- GitHub: [qinyuanpei](https://github.com/qinyuanpei)

