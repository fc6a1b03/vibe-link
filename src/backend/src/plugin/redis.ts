import {FastifyInstance} from "fastify";

/**
 * 注册Redis
 * @param fastify
 */
export default async function redisRegister(fastify: FastifyInstance) {
    await fastify.register(require('@fastify/redis'), {
        noDelay: true,
        minClients: 5,
        maxClients: 50,
        idleTimeout: 15_000,
        connectTimeout: 5000,
        socketKeepalive: true,
        maxRetriesPerRequest: 3,
        enableReadyCheck: false,
        enableOfflineQueue: true,
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASS,
    });
    await redisReady(fastify);
}

/**
 * 检查连接
 * @param fastify
 */
export async function redisReady(fastify: FastifyInstance) {
    if (!fastify.redis) throw new Error("Redis装饰器未注入");
    try {
        await fastify.redis.ping();
        fastify.log.info("🌿 Redis连接正常");
    } catch (err) {
        fastify.log.error(`🔴 Redis心跳检测失败: ${err.message}`);
    }
}