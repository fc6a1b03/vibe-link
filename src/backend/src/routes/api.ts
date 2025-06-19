import {FastifyInstance} from "fastify"
import {query} from "@backend/plugins/mysql"

/**
 * 服务控制器
 * @param fastify
 */
export default async function api(fastify: FastifyInstance) {
    fastify.get('/health', {
        schema: {
            tags: ['system'],
            summary: '服务健康检查',
            response: {
                200: {
                    type: 'object',
                    properties: {
                        message: {type: 'string', example: 'Normal Service'}
                    }
                }
            }
        }, handler: async () => {
            return {message: 'Normal Service'};
        }
    });
    fastify.get('/redis', {
        schema: {
            tags: ['test'],
            summary: 'Redis操作',
            querystring: {
                type: 'object',
                required: ['value'],
                properties: {
                    value: {
                        type: 'string',
                        description: '要存储的值'
                    }
                }
            },
            response: {
                200: {
                    type: 'string',
                    description: '存储的值'
                }
            }
        },
        handler: async (req, _) => {
            await fastify.redis.set("msg", req.query['value']);
            return await fastify.redis.get("msg");
        }
    });
    fastify.get('/mysql', {
        schema: {
            tags: ['test'],
            summary: 'MySQL查询',
            querystring: {
                type: 'object',
                required: ['id'],
                properties: {
                    value: {
                        type: 'string',
                        description: 'id'
                    }
                }
            },
            response: {
                200: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            dual: {type: 'number'}
                        }
                    }
                }
            }
        },
        handler: async (req, _) => {
            return query(fastify, "SELECT 1 + ? AS `dual`", req.query['id'])
        }
    });
    fastify.get('/nano', {
        schema: {
            tags: ['test'],
            summary: 'MQTT消息发布',
            querystring: {
                type: 'object',
                required: ['id'],
                properties: {
                    value: {
                        type: 'string',
                        description: 'id'
                    }
                }
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        message: {type: 'string', example: 'ok'},
                        topic: {type: 'string'}
                    }
                }
            }
        },
        handler: async (req, _) => {
            fastify.mqtt.publish("topic/test/A", req.query['value'])
            return {message: 'ok'}
        }
    });
}