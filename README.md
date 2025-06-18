# Vibe-Link Monorepo 项目

目前还不知道要干什么的

## 🧰 技术架构

- **前端系统**：Vue 3.5 + Vite 6.3 (TypeScript + Vue 单文件组件) + Vue Router 4.5.1
- **后端系统**：Fastify 5.4 + Bun 运行时 + MySQL 3.14 + Redis 7.0
- **构建体系**：Bun 1.2.16（零配置包管理 & 首选ES模块）
- **项目结构**：单体仓库架构支持依赖共享与跨模块引用
- **数据存储**：Redis 7.0 + MySQL 3.14 通过 @fastify 插件集成
- **消息传输**：NanoMQ 0.23.8 通过 mqtt 插件集成

## 📁 目录结构

```tree
vibe-link/
├── src/
│   ├── frontend/           # Vue 应用
│   │   ├── src/            # 源码目录
│   │   │   ├── views/      # 视图文件
│   │   │   ├── App.vue     # 应用根组件
│   │   ├── index.html      # 入口文件
│   │   ├── vite.config.ts  # Vite 配置
│   │   └── package.json    # frontend层配置
│   ├── backend/            # Fastify 服务
│   │   ├── src/
│   │   │   ├── controller/ # 控制器
│   │   │   │   ├── api.mts  # 接口
│   │   │   │   ├── view.mts # 视图（编译后才能访问,挂载vue静态目录）
│   │   │   └── plugin/     # 插件配置
│   │   │   │   ├── mysql.mts   # mysql封装
│   │   │   │   ├── nano.mts  # nanomq封装
│   │   │   │   ├── redis.mts   # redis封装
│   │   │   ├── fastify.config.mts # Fastify 配置
│   │   └── package.json  # backend层配置  
│   └── common/           # 共享代码
│       ├── src/          # 工具函数/类型定义
│       └── package.json  # common层配置
├── .env                  # 参数配置
├── package.json          # 根配置
├── Dockerfile            # 容器配置
└── tsconfig.json         # 项目引用配置 
```

## 🔧 开发配置

### 环境准备

[Bun 1.2.16](https://bun.sh)

### 启动服务

### 运行

```bash
bun run dev
```

### 构建

```bash
bun run build
```

