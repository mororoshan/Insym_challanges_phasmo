# Build stage
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* yarn.lock* ./
RUN if [ -f yarn.lock ]; then corepack enable && yarn install --frozen-lockfile; elif [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY . .

# Skip dev server and HTTPS in build (Vite uses build command)
ENV NODE_ENV=production
RUN if [ -f yarn.lock ]; then yarn build; else npm run build; fi

# Serve stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
