# Etapa 1: Construcción de la aplicación
FROM node:alpine AS build

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos package.json y package-lock.json
COPY package*.json ./


# Instala las dependencias sin --force
RUN npm install --force

# Copia el resto del código del proyecto
COPY . .

