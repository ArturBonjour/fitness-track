# Этап 1 — сборка React
FROM node:20-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci --omit=dev
COPY client/ ./
RUN npm run build

# Этап 2 — сервер + статика
FROM node:20-alpine
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --omit=dev
COPY server/ ./
# Кладём клиентскую сборку туда, откуда её раздаёт Express
COPY --from=client-build /app/client/build ../client/build
ENV NODE_ENV=production
EXPOSE 5001
CMD ["node", "server.js"]
