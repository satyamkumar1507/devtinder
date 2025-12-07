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

# we can add non root user to make it more secure -- If your Node.js app gets hacked, the attacker won’t have root inside the container.---
# Non-root users cannot:
#  install packages
#  modify system directories
#  change OS files   
 
# # Create non-root user
    # RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Switch to that user
    # USER appuser

