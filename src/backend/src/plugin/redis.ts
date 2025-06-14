/**
 * 注册Redis
 * @param fastify
 */
export default async function redisRegister(fastify: any) {
    await fastify.register(require('@fastify/redis'), {
        connectTimeout: 5000,
        maxRetriesPerRequest: 3,
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
export async function redisReady(fastify: any) {
    if (!fastify.redis) throw new Error("Redis装饰器未注入");
    try {
        await fastify.redis.ping();
        fastify.log.info("🟢 Redis运行时连接正常");
    } catch (err) {
        fastify.log.error(`🔴 Redis心跳检测失败: ${err.message}`);
    }
}