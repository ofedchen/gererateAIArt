FROM node:22-slim

WORKDIR /app

COPY backend/package.json backend/package-lock.json ./backend/
RUN cd backend && npm ci --omit=dev

COPY backend/ ./backend/
COPY frontend/ ./frontend/

RUN mkdir -p /app/backend/uploads

WORKDIR /app/backend

EXPOSE 3001

CMD ["node", "index.js"]
