import {FastifyInstance} from "fastify"
import {query} from "@backend/plugins/mysql"

/**
 * 服务控制器
 * @param fastify
 */
export default async function api(fastify: FastifyInstance) {
    fastify.get('/health', async () => {
        return {message: 'Normal Service'};
    });
    fastify.get('/redis', async (req, _) => {
        await fastify.redis.set("msg", req.query['value']);
        return await fastify.redis.get("msg");
    });
    fastify.get('/mysql', async (req, _) => {
        return query(fastify, "SELECT 1 + ? AS `dual`", req.query['id'])
    });
    fastify.get('/nano', async (req, _) => {
        fastify.mqtt.publish("topic/test/A", req.query['value'])
        return {message: 'ok'}
    });
}