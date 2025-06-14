import Fastify from 'fastify'
import apiController from "../controller/apiController";

Fastify({
    logger: true
})
    // 注册控制器
    .register(apiController)
    // 注册监听端口
    .listen({host: '0.0.0.0', port: parseInt(process.env.BACKEND_PORT || '3001', 10)}, (err, address) => {
        if (err) throw err;
        console.log(`Server running at ${address}`);
    });