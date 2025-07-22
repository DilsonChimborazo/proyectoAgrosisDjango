
FROM --platform=$TARGETPLATFORM node:22.17.0-alpine3.21

WORKDIR /app/
COPY package*.json .
RUN npm install
COPY . .
COPY .env .
EXPOSE 5174
CMD ["npm","run","dev"]