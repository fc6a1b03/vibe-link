/**
 * 注册Mysql
 * @param fastify
 */
export default async function mysqlRegister(fastify: any) {
    await fastify.register(require('@fastify/mysql'), {
        poolSize: 10,
        promise: true,
        type: "connection",
        idleTimeout: 30000,
        connectionString: process.env.MYSQL_CONFIG
    });
    await mysqlReady(fastify);
}

/**
 * 检查连接
 * @param fastify
 */
export async function mysqlReady(fastify: any) {
    if (!fastify.mysql) throw new Error("Mysql装饰器未注入");
    try {
        await fastify.mysql.connection.query('SELECT 1');
        fastify.log.info("🟢 Mysql运行时连接正常");
    } catch (err) {
        fastify.log.error(`🔴 Mysql心跳检测失败: ${err.message}`);
    }
}