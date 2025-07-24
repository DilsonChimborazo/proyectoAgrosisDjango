FROM node:22-slim

WORKDIR /app/

# Copiar archivos de configuración primero para aprovechar el cache
COPY package*.json ./

# Instalar dependencias sin verificar opcionales (como los módulos nativos de Rollup)
RUN npm install --omit=optional --legacy-peer-deps

# Luego copia el resto del proyecto
COPY . .

# Copia también tu archivo de entorno si es necesario
COPY .env .env

EXPOSE 5173

CMD ["npm", "run", "dev"]
