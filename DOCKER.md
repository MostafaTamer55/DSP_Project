# Running the DSP Learning Platform with Docker

```bash
docker compose up -d --build
```

Then open <http://localhost:8080>. No `.env` file is required.

## 1. Architecture overview

The platform is **one service**: a React single-page app that is built to static files and served by Nginx. The running app has no backend, database, worker, cache or AI service of its own.

```text
 Browser ──HTTP──> 127.0.0.1:8080 ──> [ frontend: Nginx, port 8080 ]   network: dsp-platform_web
    │
    └──HTTPS (directly from the browser, not through the container)──>
       Google Drive, YouTube, Google Fonts, Gemini, formsubmit.co
```

| Container | Role | Built from | Port | Volumes |
|---|---|---|---|---|
| `frontend` | Serves the app; falls back to `index.html` for app routes; `/healthz` health check | `Dockerfile` | 8080 | none |

**Stack:** React 19, React Router 7, Tailwind CSS 3, Vite 8. The entry point is `index.html` → `src/main.jsx` → `src/App.jsx`.

**Image build:**

1. `node:22.23.5-alpine3.24` runs `npm ci` and `npm run build`. Node 22 matches `.mise.toml`.
2. `nginx/nginx-unprivileged:1.30.8-alpine3.24` receives only the built files and `docker/nginx.conf`. It contains no source code, `node_modules` or Node.js.

**Communication between containers:** none, because there is only one. The frontend makes no API calls to another service of this project.

### Where data is stored

Accounts, the login session, course selection and progress are kept in the **browser's `localStorage`**. The container stores nothing, so there is no Docker volume, and restarting, rebuilding or removing the container does not erase that data.

Browser storage belongs to one browser and one address. If you change the port, or switch between `localhost` and `127.0.0.1` or an IP address, the app starts with empty data; go back to the old address to see it again. Data created under `npm run dev` (port 5173) does not appear on port 8080. Clearing browser data deletes it.

### Parts of the repository that are not containerized

| Item | Why |
|---|---|
| `src/lib/`, `supabase/schema.sql`, `SUPABASE_SETUP.md` | Supabase is not part of the built app: nothing imports it and `@supabase/supabase-js` is not in `package.json`. `VITE_SUPABASE_*` therefore has no effect. |
| `src/main.tsx`, `src/App.tsx`, `src/auth/`, `src/api/`, `src/ui/` | A second app that `index.html` does not load. `VITE_API_BASE_URL` therefore has no effect. |
| `launcher/`, `release/`, `Run-DSP-Platform.bat` | Windows desktop launcher, an alternative to this setup. |
| `Deployment Files /dsp-infra.tf` | AWS deployment without Docker. Unchanged. |
| `pnpm-lock.yaml` | Out of date with `package.json`, so the image uses `package-lock.json` and npm. |

## 2. Prerequisites

- Docker Engine, or Docker Desktop on Windows and macOS.
- Docker Compose V2 (`docker compose version`).
- Internet access during the build, to Docker Hub and the npm registry.
- A web browser. Fonts, videos and PDFs load from external sites, so the browser needs internet access too.

Node.js is not needed on your computer.

## 3. Environment setup

Settings are optional. To change one:

```bash
cp .env.example .env          # Windows: copy .env.example .env
```

| Variable | Service | Applied | Default | Meaning |
|---|---|---|---|---|
| `FRONTEND_BIND_ADDRESS` | frontend | at start | `127.0.0.1` | Host address to publish on. `0.0.0.0` allows other devices on your network. |
| `FRONTEND_PORT` | frontend | at start | `8080` | Host port. |
| `VITE_GEMINI_GEM_URL` | frontend | at build | empty (link built into the app) | Link opened by the AI assistant button. A value saved in the browser as `dsp_gemini_gem_url` takes priority. |
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | none | never | n/a | Not used by the current app. |

- After changing a start-time value: `docker compose up -d`.
- After changing a build-time value: `docker compose up -d --build`.
- A variable already set in your shell overrides the one in `.env`.
- `VITE_*` values are visible to anyone who opens the site. Never put a secret in one.

To initialize the platform, run the start command. There are no migrations or seed steps.

## 4. Running the platform

| Task | Command |
|---|---|
| Build | `docker compose build` |
| Start | `docker compose up -d` |
| Start and wait until healthy | `docker compose up -d --build --wait` |
| Status | `docker compose ps` |
| Logs | `docker compose logs -f` |
| Stop and remove | `docker compose down` |
| Rebuild and restart | `docker compose up -d --build` |
| Check configuration | `docker compose config` |

### Check that it works

```bash
docker compose ps                          # STATUS should show (healthy)
curl -i http://localhost:8080/healthz      # 200, body "ok"
curl -I http://localhost:8080/dashboard    # 200
```

In Windows PowerShell, use `curl.exe` instead of `curl`.

Then open the site, log in with a demo account from `src/features/auth/context/mockAccounts.js` (or sign up), and open Lectures, Sections, Exam Bank and Progress.

## 5. Troubleshooting

| Problem | Solution |
|---|---|
| **Port conflict:** `address already in use` or `port is already allocated` | Set `FRONTEND_PORT=8090` in `.env`, run `docker compose up -d`, open port 8090. |
| **Build fails pulling an image** | Check your connection and that Docker Hub is reachable (`docker pull node:22.23.5-alpine3.24`). To use a mirror: `docker compose build --build-arg NODE_IMAGE=<image> --build-arg NGINX_IMAGE=<image>`. |
| **Build fails at `npm ci`** with a lockfile mismatch | `package.json` changed without `package-lock.json`. Run `npm install`, then commit both files. |
| **Build fails: cannot resolve a module** | The package is imported but missing from `package.json`. Add it with `npm install <name>`. |
| **Build fails: file not found** after adding a new config file or top-level folder | `.dockerignore` is an allow-list. Add the path there and add a `COPY` line in the `Dockerfile`. |
| **Clone fails on Windows** with `invalid path 'Deployment Files /...'` | The folder name ends with a space, which Windows does not allow. Rename it on GitHub, Linux or macOS: `git mv "Deployment Files " Deployment-Files`, then commit. |
| **Container exits or keeps restarting** | `docker compose logs frontend`. After editing `docker/nginx.conf`, rebuild; configuration errors appear in the log with a line number. |
| **Container is `unhealthy`** | `docker compose exec frontend wget -qO- http://127.0.0.1:8080/healthz` should print `ok`. |
| **Setting has no effect** | `docker compose config` shows the values in use. Build-time values need `--build`. |
| **Other devices cannot connect** | Set `FRONTEND_BIND_ADDRESS=0.0.0.0` and allow the port in your firewall. Over plain HTTP on a non-localhost address, the browser disables some features, such as the copy-email button. |
| **Old version still shown** | `docker compose up -d --build`, then reload the page. |
| **Accounts or progress "disappeared"** | You are using a different browser or address. See "Where data is stored". |
| **Videos, PDFs or fonts do not load** | They come from external sites. Check the browser's internet access and the sharing settings of the Drive files. |
| **Database connection failures** | Not applicable: there is no database service. |
| **Volume permission issues** | Not applicable: there are no volumes. The container filesystem is read-only by design; only `/tmp` is writable. |
| **Container-to-container network problems** | Not applicable with a single service. To test the service name from another container on the network: `docker run --rm --network dsp-platform_web nginx/nginx-unprivileged:1.30.8-alpine3.24 wget -qO- http://frontend:8080/healthz` |

## 6. Managing the service

| Task | Command |
|---|---|
| Build it | `docker compose build frontend` |
| Start it | `docker compose up -d frontend` |
| Stop it | `docker compose stop frontend` |
| View its logs | `docker compose logs -f frontend` |
| Open a shell inside | `docker compose exec frontend sh` |
| Rebuild after code changes | `docker compose up -d --build frontend` |
| Rebuild from scratch | `docker compose build --no-cache --pull frontend` |

This setup serves a production build. For live reload while editing code, use `npm run dev` on your computer.

## Design decisions and security

| Decision | Reason |
|---|---|
| Nginx instead of `vite preview` | `vite preview` is meant for local previewing, not production. |
| Unprivileged Nginx image (maintained by NGINX), user 101 | Runs without root. |
| Read-only filesystem, all capabilities dropped, `no-new-privileges` | The container only serves files. |
| Published on `127.0.0.1` by default | The app is not exposed to the network unless you choose to. |
| Pinned image versions | Repeatable builds. Review them periodically for security updates. |
| `.dockerignore` allow-list | Keeps `.env` files, Git history and local dependencies out of the build. |
| Health check in the `Dockerfile` | Compose inherits it. |
| 256 MB memory and 256 process limits; logs capped at 3 × 10 MB | Prevents runaway resource use. |
| One custom network, no `depends_on`, no volumes, no secrets | There is one stateless service with no server-side secrets. |

**Existing files changed:** only `.env.example`. No application code or build configuration changed.

### Before any public deployment

Docker does not change how the application handles security:

- Login runs entirely in the browser. Demo account passwords are included in the public JavaScript, and registered passwords are stored unencrypted in `localStorage`. This is not real authentication.
- Password reset links and codes are generated in the browser and sent through the third-party service formsubmit.co.
- Everything in `public/`, including `gemini-material/`, is downloadable by anyone who can reach the site.
- The committed bundle in `release/dist/` contains a Supabase project URL and publishable key. Publishable keys are meant to be public, but check that row-level security is enabled on that project, or disable the project if it is unused.
- The container serves plain HTTP. Put a TLS reverse proxy or load balancer in front of it.

### If a backend or database is added later

Add it as a new service in `docker-compose.yml`, put it on a private network, publish only what the browser must reach, add a health check, and use a named volume for its data. Note that a browser cannot resolve Docker service names: the frontend would need a public API address, or an Nginx proxy route.
