# ===== Stage 1: Build the app =====
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Build the optimized production version
RUN npm run build


# ===== Stage 2: Serve the app using Nginx =====
FROM nginx:stable-alpine AS production

# Copy built files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (default for HTTP)
EXPOSE 5173

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
