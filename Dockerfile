# DSP Learning Platform - frontend (static React single-page app)
# Stage 1 builds the app with Vite; stage 2 serves the result with Nginx.

# Base images are pinned. They can be overridden with --build-arg,
# for example to pull through a registry mirror.
ARG NODE_IMAGE=node:22.23.5-alpine3.24
ARG NGINX_IMAGE=nginx/nginx-unprivileged:1.30.8-alpine3.24

# ---- Build stage --------------------------------------------------------
FROM ${NODE_IMAGE} AS build
WORKDIR /app

# Dependency layer: reused until package.json or package-lock.json changes.
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund

COPY index.html vite.config.js vite.config.ts tsconfig.json tailwind.config.js postcss.config.js ./
COPY public ./public
COPY src ./src

# Vite writes VITE_* values into the JavaScript bundle at build time, and the
# bundle is public. Never pass a secret this way.
# An empty value makes the app use its built-in default link.
ARG VITE_GEMINI_GEM_URL=""

# chmod: keep files readable by the web server even if the checkout on the
# host has restrictive permissions.
RUN npm run build && chmod -R a+rX dist

# ---- Runtime stage ------------------------------------------------------
FROM ${NGINX_IMAGE} AS runtime

COPY --chmod=644 docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

# Unprivileged "nginx" user provided by the base image.
USER 101

EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1

# SIGQUIT lets Nginx finish in-flight requests before exiting.
STOPSIGNAL SIGQUIT
CMD ["nginx", "-g", "daemon off;"]
