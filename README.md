# House of Musa

Ultra-premium IT company website — cinematic 3D hero, first-person product gallery, and a full
content/ops backend. pnpm monorepo: `apps/web` (public site), `apps/admin` (dashboard), `apps/api`
(REST API), `packages/*` (shared types/schemas/ui/config).

Full documentation lives in [`docs/`](./docs):
[PRD](./docs/PRD.md) · [Architecture](./docs/ARCHITECTURE.md) · [Design System](./docs/DESIGN-SYSTEM.md) ·
[Database](./docs/DATABASE.md) · [API](./docs/API.md) · [Roadmap](./docs/ROADMAP.md)

The original brief is preserved verbatim in [`prompt.md`](./prompt.md).

## Getting started

```
pnpm install
cp apps/web/.env.example apps/web/.env.local
cp apps/admin/.env.example apps/admin/.env.local
cp apps/api/.env.example apps/api/.env

pnpm dev:api      # http://localhost:4000 — needs a running MongoDB (MONGODB_URI in apps/api/.env)
pnpm dev:web      # http://localhost:3000
pnpm dev:admin    # http://localhost:3001

# create your first admin login:
pnpm --filter @houseofmusa/api seed:admin admin@houseofmusa.com "a-strong-password" "House of Musa Admin"
```

The headquarters model (`house.glb`), the gallery environment (`gallery.glb`), and both logo variants are
already in place under `apps/web/public/` (and `apps/admin/public/logo/`) — see
[`apps/web/public/models/README.md`](./apps/web/public/models/README.md) if the house model's scale/position
needs tuning once viewed in-browser.

`apps/api/.env` is pre-configured to a MongoDB Atlas cluster — not committed (gitignored), so anyone else
setting up the repo needs their own `MONGODB_URI`.

## Render deployment

The public web app is a static export. If `NEXT_PUBLIC_API_URL` is unset, it builds with bundled placeholder
products and career roles, and runtime submissions that need the API are disabled. Leave it unset until the
API exists; do not set it to `localhost` on Render. Once the API exists, set `NEXT_PUBLIC_API_URL` on the
Render Static Site to the public, reachable API origin without a trailing slash, for example
`https://houseofmusa-api.onrender.com`.
