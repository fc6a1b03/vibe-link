import dotenv from "dotenv"
import Fastify from "fastify"
import * as path from "node:path"
import api from "@backend/controller/api"
import view from "@backend/controller/view"

// 读取环境配置
dotenv.config({path: path.resolve(__dirname, "..", "..", ".env")});
// 注册Fastify
Fastify({
    logger: Boolean(process.env.BACKEND_LOGGER === 'true')
})
    // 注册控制器
    .register(view)
    .register(api, {prefix: process.env.BACKEND_PREFIX})
    // 注册监听端口
    .listen({
        host: '0.0.0.0',
        port: parseInt(process.env.BACKEND_PORT || '3001')
    }, (err, address) => {
        if (err) throw err;
        console.log(`Server running at ${address}`);
    });