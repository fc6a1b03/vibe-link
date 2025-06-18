import mqtt from "mqtt"
import {FastifyInstance} from "fastify"

/**
 * 注册NanoMq
 * @param fastify
 */
export default async function nanoRegister(fastify: FastifyInstance) {
    // 初始化MQTT客户端
    const client = mqtt.connect(process.env.NANO_URL, {
        clean: false,
        keepalive: 30,
        protocolVersion: 5,
        reconnectPeriod: 5000,
        rejectUnauthorized: false,
        username: process.env.MQTT_USER,
        password: Buffer.from(process.env.MQTT_PASS),
        clientId: `${process.env.MQTT_CLIENT_ID}-${Date.now()}`,
        properties: {
            receiveMaximum: 10000,
            topicAliasMaximum: 20,
            sessionExpiryInterval: 86400
        }
    });
    // 注入到Fastify实例
    fastify.decorate("mqtt", client);
    // 服务关闭时断开MQTT连接
    fastify.addHook("onClose", async () => client.end());
    // 连接事件处理
    client.on("connect", () => fastify.log.info("✅  MQTT 连接正常"));
    client.on("error", (err) => fastify.log.error(`❌  MQTT 连接错误: ${err.message}`));
}