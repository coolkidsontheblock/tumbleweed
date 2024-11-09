# Frontend build

FROM node:20 AS frontend-builder

WORKDIR /frontend

COPY frontend/package*.json ./

RUN npm install

COPY frontend ./

RUN npm run build

# Backend build

FROM node:20

WORKDIR /backend

COPY backend/package*.json ./

RUN npm install

COPY backend ./

COPY --from=frontend-builder /frontend/dist ./dist

EXPOSE 3001

CMD ["npm", "start"]