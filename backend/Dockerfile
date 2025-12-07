FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./


FROM base AS dev_deps
RUN npm ci


FROM base AS prod_deps
RUN npm ci --omit=dev


FROM node:20-alpine AS prod
WORKDIR /app
COPY --from=prod_deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
