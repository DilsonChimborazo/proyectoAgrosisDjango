
FROM node:22.17.0-alpine3.21
WORKDIR /app/
COPY package*.json .
RUN npm install
COPY . .
ENV API=https://apiv1.miweb.com
EXPOSE 5173
CMD ["npm", "run", "dev"]

