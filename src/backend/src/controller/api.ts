import {FastifyInstance} from "fastify";

/**
 * 服务控制器
 * @param fastify
 */
export default async function api(fastify: FastifyInstance) {
    fastify.get('/', async () => {
        return {message: 'Normal Service'};
    });
}