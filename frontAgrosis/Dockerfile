
FROM node:22.17.0-alpine3.21
WORKDIR /app/
COPY package*.json .
RUN npm install
COPY . .
COPY .env .
EXPOSE 5173
CMD ["npm", "run", "dev"]

