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
    echo "POSTGRES_USER=postgres" >> .env && \
    echo "POSTGRES_HOST=db" >> .env && \
    echo "POSTGRES_DATABASE=userconfig" >> .env && \
    echo "POSTGRES_PASSWORD=postgres" >> .env && \
    echo "KAFKA_BROKER_ENDPOINTS=localhost:29092, localhost:39092, localhost:49092" >> .env

COPY --from=frontend-builder /frontend/dist ./dist

EXPOSE 3001

CMD ["npm", "start"]