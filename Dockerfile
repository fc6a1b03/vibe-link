# 构建
FROM oven/bun:1-alpine AS builder
WORKDIR app
COPY . .
RUN bun i && bun run build
RUN ls -la /app/src/backend
RUN ls -la /app/src/frontend

################################

# 最终运行时
FROM oven/bun:1-alpine
WORKDIR app
RUN mkdir -p backend public node_modules
COPY --from=builder /app/src/backend/dist /app/backend
COPY --from=builder /app/src/frontend/dist /app/public
COPY --from=builder /app/node_modules /app/node_modules

EXPOSE 3001
CMD ["bun", "run", "backend/app.js"]