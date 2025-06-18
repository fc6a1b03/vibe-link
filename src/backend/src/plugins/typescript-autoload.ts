import path from 'path'
import {Glob} from 'bun'
import {FastifyPluginAsync} from 'fastify'

declare module 'fastify' {
    interface FastifyInstance {
        tsAutoload: typeof tsAutoload;
    }
}

const tsAutoload: FastifyPluginAsync<{
    prefix?: string;
    dirs?: Array<string>;
    exclude?: Array<string>;
}> = async (fastify, options) => {
    const {dirs, exclude} = options;
    // 扫描器
    const glob = new Glob("**/*.{ts}");
    // 排除器
    const excludeGlob = exclude.length > 0 ? new Glob(`{${exclude.join(',')}}`) : null;
    // 动态导入指定的路由文件
    for (const dir of dirs) {
        for await (const file of glob.scan(dir)) {
            try {
                // 排除 文件 或 目录
                if (excludeGlob && excludeGlob.match(file)) {
                    fastify.log.info(`🚫 已排除路由: ${file}`);
                    continue;
                }
                // 导入路由
                const routeModule = await import(path.join(dir, file));
                if (routeModule.default) {
                    // 注册路由
                    fastify.register(routeModule.default, {prefix: ""});
                    fastify.log.info(`✅  Swagger 成功加载 TypeScript 路由: ${file}`);
                }
            } catch (error) {
                fastify.log.info(`❌  Swagger 加载 TypeScript 文件失败: ${file}`, error);
            }
        }
    }
}
export default tsAutoload;