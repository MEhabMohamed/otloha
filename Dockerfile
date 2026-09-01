# Build React Frontend
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

# Run Production Server
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production --legacy-peer-deps
COPY --from=builder /app/build ./build
COPY server.js ./
COPY schema.sql ./
COPY init-db.js ./

EXPOSE 8080
CMD ["node", "server.js"]
