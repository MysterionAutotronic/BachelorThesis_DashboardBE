# ---------- build stage ----------
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci

# copy source & compile TS → JS
COPY tsconfig.json ./
COPY src ./src
RUN npx tsc -p tsconfig.json

# ---------- production stage ----------
FROM node:20-alpine

WORKDIR /app
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080
CMD ["node", "dist/server.js"]
