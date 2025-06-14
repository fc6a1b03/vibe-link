import {FastifyInstance} from "fastify";

/**
 * 服务控制器
 * @param fastify
 */
export default async function api(fastify: FastifyInstance) {
    fastify.get('/', async () => {
        return {message: 'Normal Service'};
    });
    fastify.get('/redis', async (request, reply) => {
        await fastify.redis.set("msg", request.query['value']);
        return await fastify.redis.get("msg");
    });
}