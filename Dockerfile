# syntax=docker/dockerfile:1

# --- Stage 1: Build React + Vite frontend ---
FROM node:22-bookworm-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./

ENV NODE_OPTIONS="--dns-result-order=ipv4first"
RUN npm config set fetch-retries 5 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm config set fetch-retry-maxtimeout 120000 \
 && npm config set maxsockets 2 \
 && npm ci --no-audit --no-fund

COPY . .

ARG VITE_SUPABASE_URL=""
ARG VITE_SUPABASE_ANON_KEY=""
ARG VITE_API_BASE_URL=""
ARG VITE_GEMINI_GEM_URL=""

ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_GEMINI_GEM_URL=${VITE_GEMINI_GEM_URL}

RUN npm run build

# --- Stage 2: Serve static bundle with Nginx ---
FROM nginx:1.27-alpine AS production

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
