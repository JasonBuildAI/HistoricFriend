# 🌍 历史人物朋友圈

一键生成历史人物的模拟朋友圈，穿越时空看看古人的社交动态！

## ✨ 功能特点

- 🤖 **AI智能生成**：使用DeepSeek AI智能生成符合历史人物性格和时代背景的朋友圈
- 🎭 **真实模拟**：包含头像、昵称、动态内容、图片、点赞、评论等完整朋友圈元素
- 🎨 **精美界面**：现代化的UI设计，完美复刻朋友圈体验
- ⚡ **快速响应**：一键生成，即刻体验
- 📱 **响应式设计**：适配各种屏幕尺寸

## 🚀 快速开始

### 前置要求

- Node.js (v14 或更高版本)
- npm 或 yarn

### 安装和运行

1. **克隆仓库**
```bash
git clone https://github.com/JasonBuildAI/HistoricFriend.git
cd HistoricFriend
```

2. **安装后端依赖**
```bash
cd backend
npm install
```

3. **安装前端依赖**
```bash
cd ../frontend
npm install
```

4. **启动后端服务**
```bash
cd ../backend
npm start
```
后端服务将在 http://localhost:4000 启动

5. **启动前端服务**
```bash
cd ../frontend
npm run dev
```
前端服务将在 http://localhost:5173 启动（或其他可用端口）

## 🎯 使用说明

1. 在输入框中输入任意历史人物的名字（如：李白、苏轼、秦始皇、孔子等）
2. 点击"生成朋友圈"按钮或按回车键
3. 或者直接点击下方预设的人物标签快速生成
4. 等待AI生成符合该历史人物性格和时代背景的朋友圈
5. 可以点击点赞按钮与朋友圈互动

## 🛠️ 技术栈

### 后端
- **Node.js** - JavaScript运行环境
- **Express** - Web应用框架
- **Axios** - HTTP客户端，用于调用DeepSeek API
- **CORS** - 跨域资源共享中间件

### 前端
- **Vue 3** - 渐进式JavaScript框架
- **Vite** - 下一代前端构建工具
- **Axios** - HTTP客户端
- **CSS3** - 现代化样式设计

### AI服务
- **DeepSeek API** - 强大的AI大语言模型

## 📁 项目结构

```
HistoricFriend/
├── backend/
│   ├── server.js          # 后端服务器主文件
│   ├── package.json       # 后端依赖配置
│   └── uploads/           # 文件上传目录
├── frontend/
│   ├── src/
│   │   ├── App.vue        # 主应用组件
│   │   ├── main.js        # 前端入口文件
│   │   └── style.css      # 样式文件
│   ├── index.html         # HTML模板
│   ├── vite.config.js     # Vite配置
│   └── package.json       # 前端依赖配置
└── README.md              # 项目说明文档
```

## 🔧 API接口

### 生成朋友圈
- **URL**: `POST /api/generate-moments`
- **参数**: 
```json
{
  "name": "历史人物名字"
}
```
- **响应**:
```json
{
  "success": true,
  "data": {
    "name": "人物名字",
    "avatar": "emoji头像",
    "content": "朋友圈内容",
    "images": ["图片描述1", "图片描述2"],
    "likes": ["好友1", "好友2"],
    "comments": [
      {"user": "评论者", "text": "评论内容"}
    ]
  }
}
```

### 健康检查
- **URL**: `GET /api/health`
- **响应**: 
```json
{
  "status": "ok",
  "message": "历史人物朋友圈生成器服务正常运行"
}
```

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

本项目采用 Apache License 2.0 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- 感谢 [DeepSeek](https://www.deepseek.com/) 提供强大的AI能力
- 感谢所有为这个项目做出贡献的开发者

---

<p align="center">
  Made with ❤️ by JasonBuildAI
</p>
