import {readFileSync} from 'fs'
import * as path from 'node:path'
import {FastifyInstance} from 'fastify'

/**
 * 注册Swagger
 * @param fastify
 */
export default async function swaggerRegister(fastify: FastifyInstance) {
    // 注册swagger
    await fastify.register(require('@fastify/swagger'), {
        openapi: {
            info: {
                title: 'Vibe Link Docs',
                description: '社交平台后端 API',
                version: JSON.parse(readFileSync(path.join(__dirname, '..', '..', '..', '..', 'package.json'), 'utf-8')).version
            },
            servers: [{
                url: `http://localhost:${process.env.BACKEND_PORT}`, description: 'Vibe Link Server'
            }],
            tags: [
                {name: 'user', description: '用户服务'},
                {name: 'test', description: '测试接口'},
                {name: 'system', description: '服务健康检查'}
            ],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT'
                    }
                }
            }
        }
    });
    await fastify.register(require('@fastify/swagger-ui'), {
        staticCSP: true,
        routePrefix: process.env.SWAGGER_PREFIX
    });
    // 自动扫描路由
    await fastify.register(require('@backend/plugins/swagger-autoload'), {
        exclude: ['view.ts'],
        prefix: process.env.BACKEND_PREFIX,
        dirs: [path.join(__dirname, '..', 'routes')]
    });
    await redisReady(fastify)
}

/**
 * 检查连接
 * @param fastify
 */
export async function redisReady(fastify: FastifyInstance) {
    if (!fastify.swagger) throw new Error('Swagger装饰器未注入');
    fastify.ready(() => {
        try {
            const url = fastify.swagger()?.servers[0]?.url;
            if (url) {
                fastify.log.info(`✅  Swagger 启动正常 | ${url}${process.env.SWAGGER_PREFIX}`);
            } else {
                fastify.log.error(`❌  Swagger 启动失败`);
            }
        } catch (err) {
            fastify.log.error(`❌  Swagger 启动失败: ${err.message}`);
        }
    });
}