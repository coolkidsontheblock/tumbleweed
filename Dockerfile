# Frontend build

FROM node:20 AS frontend-builder

WORKDIR /frontend

COPY frontend/package*.json ./

RUN npm install

COPY frontend ./

RUN touch .env

RUN npm run build

# Backend build

FROM node:20

WORKDIR /backend

COPY backend/package*.json ./

RUN npm install

COPY backend ./

RUN touch .env && \
    echo "NODE_ENV=production" >> .env && \
    echo "POSTGRES_USER=tumbleweed_user" >> .env && \
    echo "POSTGRES_HOST=db" >> .env && \
    echo "POSTGRES_DATABASE=user_configs" >> .env && \
    echo "POSTGRES_PASSWORD=postgres" >> .env && \
    echo "KAFKA_BROKER_ENDPOINTS=kafka-1.kafka.local:19092,kafka-2.kafka.local:19092,kafka-3.kafka.local:19092" >> .env

COPY --from=frontend-builder /frontend/dist ./dist

EXPOSE 3001

CMD ["npm", "start"]