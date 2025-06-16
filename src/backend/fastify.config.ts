import dotenv from "dotenv"
import Fastify from "fastify"
import {Redis} from "ioredis"
import * as path from "node:path"
import api from "@backend/controller/api"
import view from "@backend/controller/view"
import {MySQLPromisePool} from "@fastify/mysql"
import redisRegister from "@backend/plugin/redis"
import mysqlRegister from "@backend/plugin/mysql"

// 初始化环境配置
dotenv.config({path: path.resolve(__dirname, "..", "..", ".env")});
// 注册插件模组
declare module 'fastify' {
    interface FastifyInstance {
        redis: Redis
        mysql: MySQLPromisePool
    }
}

/**
 * 服务入口
 */
async function main() {
    // 注册Fastify
    const fastify = Fastify({
        logger: process.env.BACKEND_LOGGER === 'true'
    });
    // 注册插件
    await redisRegister(fastify);
    await mysqlRegister(fastify);
    // 注册控制器
    await fastify.register(view);
    await fastify.register(api, {prefix: process.env.BACKEND_PREFIX});
    // 注册监听端口
    fastify.listen({
        host: '0.0.0.0',
        port: parseInt(process.env.BACKEND_PORT || '3001')
    }, (err, address) => {
        if (err) throw err;
        console.log(`🚀 Server running at ${address}`);
    });
}


/**
 * 启动服务
 */
main().catch(console.error);