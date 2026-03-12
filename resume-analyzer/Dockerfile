# ========== Stage 1: Build the React app ==========
# Uses Node.js to install dependencies and create an optimized production build
FROM node:22-alpine AS build

# Set working directory inside the container
WORKDIR /app

# Copy package files FIRST (for Docker layer caching)
# If these haven't changed, "npm ci" is skipped on rebuild
COPY package.json package-lock.json ./

# "npm ci" is like "npm install" but stricter:
# - Uses exact versions from package-lock.json (no surprises)
# - Faster and more reliable for CI/Docker builds
RUN npm ci

# Now copy the rest of the source code and build
COPY . .

# Tell React to use relative /api path — Nginx proxies this to Django backend
ENV REACT_APP_API_BASE=/api

# Creates an optimized production build in /app/build/
# This is the same as running "npm run build" locally
RUN npm run build

# ========== Stage 2: Serve with Nginx ==========
# Why two stages? Stage 1 installs Node + 500MB of npm packages just to build.
# We only need the final HTML/CSS/JS files (~5MB).
# Stage 2 uses a tiny Nginx image (~20MB) to serve those static files.
# Final image = ~25MB instead of ~600MB
FROM nginx:alpine

# Copy ONLY the built files from Stage 1 into Nginx's serve directory
# --from=build references the "AS build" stage above
COPY --from=build /app/build /usr/share/nginx/html

# Copy our custom Nginx config (handles React Router + API proxy)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx listens on port 80
EXPOSE 80

# Start Nginx in the foreground (Docker needs a foreground process)
# "daemon off" prevents Nginx from running in background (which would make the container exit)
CMD ["nginx", "-g", "daemon off;"]