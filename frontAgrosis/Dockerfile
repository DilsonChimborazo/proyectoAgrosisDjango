# Etapa 1: Construcción
FROM node:22-slim AS builder
WORKDIR /app
COPY package*.json ./
COPY vite.config.ts ./
COPY tsconfig.json ./
COPY . .
COPY .env .env
RUN npm install --legacy-peer-deps
RUN npm run build

# Etapa 2: Servidor Nginx
FROM nginx:1.25-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]