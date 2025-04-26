# ---- BUILD STAGE ----
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# ---- PRODUCTION STAGE ----
FROM nginx:alpine

# Copy the built app from previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Custom nginx config (for SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port and run nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]