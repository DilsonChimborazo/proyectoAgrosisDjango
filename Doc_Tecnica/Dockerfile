
FROM node:22-slim
WORKDIR /app/
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 4321
CMD ["npm", "run", "dev"]