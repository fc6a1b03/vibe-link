import * as path from "node:path"
import vue from "@vitejs/plugin-vue"
import {defineConfig, loadEnv} from "vite"

export default (mode: any) => {
    // 读取环境配置
    const env = loadEnv(mode, path.resolve(__dirname, '..', '..'));
    // 注册Vite
    return defineConfig({
        plugins: [vue()],
        server: {
            host: '0.0.0.0',
            port: parseInt(env.VITE_PORT || '3000'),
            proxy: {
                '/api': {
                    changeOrigin: true,
                    target: env.VITE_API_URL,
                    configure: (proxy) => {
                        // 记录请求发出日志
                        proxy.on("proxyReq", (_, req) =>
                            console.log(`[Proxy] → ${req.method} ${req.url}`)
                        );
                        // 记录响应接收日志
                        proxy.on("proxyRes", (proxyRes, req) =>
                            console.log(`[Proxy] ← ${proxyRes.statusCode} ${req.url} (${proxyRes.headers["content-type"]})`)
                        );
                        // 错误处理日志
                        proxy.on("error", (err) => console.error("[Proxy] ✗ Error:", err));
                    },
                }
            }
        }
    })
}