import {FastifyInstance} from "fastify"
import {MySQLRowDataPacket} from "@fastify/mysql"

/**
 * 注册Mysql
 * @param fastify
 */
export default async function mysqlRegister(fastify: FastifyInstance) {
    await fastify.register(require('@fastify/mysql'), {
        type: "pool",
        promise: true,
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER,
        database: process.env.MYSQL_DATABASE,
        password: Buffer.from(process.env.MYSQL_PASS),
        pool: {
            min: 2,
            max: 10,
            queueLimit: 100,
            idleTimeout: 30_000,
            enableKeepAlive: true,
            acquireTimeout: 10_000,
            idlePingInterval: 60_000,
            verifyIdleConnections: true,
            keepAliveInitialDelay: 30_000
        }
    });
    await mysqlReady(fastify);
}

/**
 * 检查连接
 * @param fastify
 */
export async function mysqlReady(fastify: FastifyInstance) {
    if (!fastify.mysql) throw new Error("Mysql装饰器未注入");
    try {
        await fastify.mysql.query('SELECT 1');
        fastify.log.info("✅  Mysql连接正常");
    } catch (err) {
        fastify.log.error(`❌  Mysql心跳检测失败: ${err.message}`);
    }
}

/**
 * 查询数据
 * @param fastify
 * @param sql
 * @param params
 */
export async function query(fastify: FastifyInstance, sql: string, params?: any[]) {
    const [rows] = await fastify.mysql.query<MySQLRowDataPacket[]>(sql, params);
    return rows[0] || null;
}