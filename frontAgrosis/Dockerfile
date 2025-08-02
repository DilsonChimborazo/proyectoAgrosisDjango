# Etapa 1: Construcción
FROM node:22-slim AS builder

# Establece el directorio de trabajo
WORKDIR /app

# Copia archivos necesarios
COPY package*.json ./
COPY vite.config.ts ./
COPY tsconfig.json ./
COPY . .
COPY .env .env

# Instala dependencias
RUN npm install --legacy-peer-deps

# Construye el proyecto
RUN npm run build

# Etapa 2: Servidor Nginx
FROM nginx:1.25-alpine

# Elimina configuración por defecto de Nginx
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copia tu propia configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia archivos generados por Vite
COPY --from=builder /app/dist /usr/share/nginx/html

# Expone el puerto en el que Nginx sirve
EXPOSE 80

# Comando para ejecutar nginx
CMD ["nginx", "-g", "daemon off;"]