import fs from "fs"
import mqtt, {type MqttClient} from "mqtt"
import type {FastifyPluginAsync} from "fastify"

declare module 'fastify' {
    interface FastifyInstance {
        nanoMq: {
            publish(topic: string, payload: object): Promise<void>;
            subscribe(topics: string[]): Promise<void>;
            onMessage(cb: (topic: string, payload: Buffer) => void): void;
        };
    }
}

const nanoMqPlugin: FastifyPluginAsync = async (fastify) => {
    const client: MqttClient = mqtt.connect(process.env.nanoMq_URL!, {
        ca: fs.readFileSync('certs/ca.crt'),
        key: fs.readFileSync('certs/client.key'),
        cert: fs.readFileSync('certs/client.cert'),
        rejectUnauthorized: true // 强制双向 TLS 验证
    });

    // 消息监听器存储
    const messageListeners: ((topic: string, payload: Buffer) => void)[] = [];

    client.on('message', (topic, payload) => {
        messageListeners.forEach(cb => cb(topic, payload));
    });

    // 封装发布/订阅接口
    fastify.decorate('nanoMq', {
        async publish(topic: string, payload: object) {
            return new Promise((resolve, reject) => {
                client.publish(topic, JSON.stringify(payload), {qos: 2}, err =>
                    err ? reject(err) : resolve()
                );
            });
        },
        async subscribe(topics: string[]) {
            return new Promise((resolve, reject) => {
                client.subscribe(topics, err =>
                    err ? reject(err) : resolve()
                );
            });
        },
        onMessage(cb: (topic: string, payload: Buffer) => void) {
            messageListeners.push(cb);
        }
    });

    // Fastify 关闭时断开连接
    fastify.addHook('onClose', (_, done) => {
        client.end(false, {}, done);
    });
};

export default nanoMqPlugin;