import dotenv from 'dotenv'
import Redis from 'ioredis'
import Fastify from 'fastify'
import {MqttClient} from 'mqtt'
import * as path from 'node:path'
import api from '@backend/routes/api'
import view from '@backend/routes/view'
import {MySQLPromisePool} from '@fastify/mysql'
import nanoRegister from '@backend/plugins/nano'
import redisRegister from '@backend/plugins/redis'
import mysqlRegister from '@backend/plugins/mysql'
import swaggerRegister from '@backend/plugins/swagger'

// 初始化环境配置
dotenv.config({path: path.resolve(__dirname, '..', '..', '.env')});
// 注册插件模组
declare module 'fastify' {
    interface FastifyInstance {
        redis: Redis,
        mqtt: MqttClient,
        mysql: MySQLPromisePool,
        swagger: () => Record<string, any>
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
    await nanoRegister(fastify);
    await redisRegister(fastify);
    await mysqlRegister(fastify);
    // 注册控制器
    await fastify.register(api);
    await fastify.register(view);
    // 注册文档
    await swaggerRegister(fastify);
    // 注册监听端口
    fastify.listen({
        host: '0.0.0.0',
        port: parseInt(<string>process.env.BACKEND_PORT)
    }, (err, address) => {
        if (err) throw err;
        console.log(`🚀 Server running at ${address}`);
    });
}


/**
 * 启动服务
 */
main().catch(console.error);