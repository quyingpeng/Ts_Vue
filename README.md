<!--
 * @Author: qyp
 * @Date: 2026-06-10 16:48:21
 * @LastEditors: qyp
 * @LastEditTime: 2026-07-11 22:34:00
 * @Description: 
-->
# 全栈后台管理系统 + AI 助手 + 多端应用

> 基于 **Vue3 + TypeScript + Node.js** 的全栈项目，包含后台管理、AI 对话、权限控制、数据可视化，以及 uni-app 多端适配。

---

## 项目结构

my-app/
├── src/ # Vue3 后台管理系统前端
│ ├── api/ # API 接口封装（含 AI 流式调用）
│ ├── components/ # 通用组件
│ │ ├── FormDialog.vue # 配置驱动表单弹窗
│ │ ├── ChartCard.vue # ECharts 图表卡片
│ │ ├── ImageUpload.vue # 图片上传组件
│ │ ├── AiChat.vue # AI 对话悬浮窗
│ │ ├── Breadcrumb.vue # 面包屑导航
│ │ └── ...
│ ├── composables/ # 组合式函数
│ │ └── useDebounce.ts # 防抖
│ ├── directives/ # 自定义指令
│ │ ├── permission.ts # v-permission / v-role
│ │ └── index.ts
│ ├── layouts/ # 布局组件
│ │ └── DefaultLayout.vue
│ ├── router/ # 路由配置与守卫
│ │ ├── index.ts
│ │ └── guards.ts
│ ├── stores/ # Pinia 状态管理
│ │ ├── user.ts # 用户状态（登录/退出）
│ │ ├── theme.ts # 暗黑模式状态
│ │ └── counter.ts # 计数器示例
│ ├── types/ # TypeScript 类型定义
│ │ └── api.ts
│ ├── utils/ # 工具函数
│ │ └── request.ts # Axios 封装
│ └── views/ # 页面
│ ├── LoginView.vue # 登录页
│ ├── DashboardView.vue # 仪表盘
│ └── UserListView.vue # 用户管理
├── server/ # Node.js + Express 后端
│ ├── src/
│ │ ├── db.ts # SQLite 数据库初始化
│ │ └── index.ts # 接口服务（登录、用户 CRUD）
│ ├── package.json
│ └── tsconfig.json
├── uni-app/ # uni-app 多端应用
│ ├── pages/
│ │ ├── index/index.vue # 登录页
│ │ ├── list/list.vue # 用户列表
│ │ └── user/user.vue # 用户详情
│ ├── pages.json
│ └── package.json
├── .env.local # 环境变量（需自行创建）
├── package.json
└── README.md

---

## 技术栈

| 层级 | 技术 |
|:---|:---|
| 前端框架 | Vue 3 (Composition API + `<script setup>`) |
| 类型系统 | TypeScript |
| 构建工具 | Vite |
| 状态管理 | Pinia（持久化） |
| 路由 | Vue Router（路由守卫） |
| UI 组件库 | Element Plus |
| 数据可视化 | ECharts |
| HTTP 请求 | Axios（拦截器封装） |
| 后端框架 | Node.js + Express |
| 数据库 | SQLite (better-sqlite3) |
| 鉴权 | JWT (jsonwebtoken) |
| 多端应用 | uni-app (Vue 3 + TypeScript) |
| AI 集成 | DeepSeek / Gemini（流式输出） |

---

## 快速开始

### 1. 环境要求

- Node.js >= 18
- npm >= 9
- Git

### 2. 克隆项目

```bash
git clone <你的仓库地址>
cd my-app
### 3. 配置环境变量
在项目根目录创建 .env.local：
VITE_API_BASE_URL=http://localhost:3000/api
VITE_DEEPSEEK_API_KEY=你的API_Key
VITE_DEEPSEEK_BASE_URL=https://api.deepseek.com
4. 启动后端（终端1）
cd server
npm install
npm run dev
# 后端运行在 http://localhost:3000
# 首次运行自动创建数据库，默认管理员：admin / admin123
5. 启动前端（终端2）
bash
# 回到项目根目录
npm install
npm run dev
# 前端运行在 http://localhost:5173
6. 启动 uni-app（终端3，可选）
bash
cd uni-app
npm install

# H5 版本（浏览器）
npm run dev:h5

# 微信小程序（需安装微信开发者工具）
npm run dev:mp-weixin
