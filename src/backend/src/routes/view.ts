import * as path from 'node:path'
import {FastifyInstance} from 'fastify'
import fastifyStatic from '@fastify/static'

/**
 * 视图控制器
 * @param fastify
 */
export default async function view(fastify: FastifyInstance) {
    // 注册静态文件
    fastify.register(fastifyStatic, {
        prefix: '/',
        wildcard: false,
        decorateReply: true,
        root: path.join(__dirname, '..', '..', '..', 'public')
    });
    fastify.get(`/*`, async (_, reply) =>
        reply.sendFile('index.html')
    );
}