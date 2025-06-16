import {FastifyInstance} from "fastify"
import {query} from "@backend/plugin/mysql"

/**
 * 服务控制器
 * @param fastify
 */
export default async function api(fastify: FastifyInstance) {
    fastify.get('/', async () => {
        return {message: 'Normal Service'};
    });
    fastify.get('/redis', async (req, _) => {
        await fastify.redis.set("msg", req.query['value']);
        return await fastify.redis.get("msg");
    });
    fastify.get('/mysql', async (req, _) => {
        return query(fastify, "SELECT 1 + ? AS `dual`", req.query['id'])
    });
}