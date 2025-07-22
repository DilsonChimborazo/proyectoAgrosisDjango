FROM node:20  
WORKDIR /app
COPY package*.json ./
RUN npm cache clean --force \
    && rm -rf node_modules package-lock.json \
    && npm install --legacy-peer-deps
COPY . .
EXPOSE 4321
CMD ["npm", "run", "dev"]