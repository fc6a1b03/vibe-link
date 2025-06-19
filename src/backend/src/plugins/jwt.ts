import {FastifyInstance} from 'fastify'
import {SignOptions} from '@fastify/jwt'

/**
 * 注册Jwt
 * @param fastify
 */
export default async function jwtRegister(fastify: FastifyInstance) {
    fastify.register(require('@fastify/jwt'), {
        secret: 'supersecret',
        cookie: {cookieName: 'token'}
    });
}

/**
 * 登录
 * @param fastify
 * @param payload 用户登录信息
 * @param options 登录选项
 */
export async function sign(fastify: FastifyInstance, payload: object, options?: Partial<SignOptions>) {
    const accessToken = fastify.jwt.sign(
        payload,
        options ? options : {expiresIn: '3h'}
    );
}