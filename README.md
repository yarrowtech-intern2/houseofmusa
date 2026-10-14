# House of Musa

Ultra-premium IT company website — cinematic 3D hero, first-person product gallery, and a full
content/ops backend. pnpm monorepo: `apps/web` (public site) and `apps/admin` (dashboard), both Next.js on
Vercel; the database, auth and file storage live in Supabase. `packages/*` hold the shared
types/schemas/ui/config plus `@houseofmusa/data`, the typed Supabase data layer both apps use.

Full documentation lives in [`docs/`](./docs):
[PRD](./docs/PRD.md) · [Architecture](./docs/ARCHITECTURE.md) · [Design System](./docs/DESIGN-SYSTEM.md) ·
[Supabase setup & deploy](./docs/SUPABASE.md) · [Database](./docs/DATABASE.md) · [API](./docs/API.md) · [Roadmap](./docs/ROADMAP.md)

The original brief is preserved verbatim in [`prompt.md`](./prompt.md).

## Getting started

Set up the Supabase project first (schema, buckets, first admin) — see [`docs/SUPABASE.md`](./docs/SUPABASE.md).

```
pnpm install
cp apps/web/.env.example apps/web/.env.local       # NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY
cp apps/admin/.env.example apps/admin/.env.local
cp supabase/.env.example supabase/.env             # service-role key, used only by the seed scripts

pnpm dev:web      # http://localhost:3000
pnpm dev:admin    # http://localhost:3001

pnpm seed:admin admin@houseofmusa.com "a-strong-password" "House of Musa Admin"
pnpm seed:products
pnpm seed:career-roles
```

The headquarters model (`house.glb`), the gallery environment (`gallery.glb`), and both logo variants are
already in place under `apps/web/public/` (and `apps/admin/public/logo/`) — see
[`apps/web/public/models/README.md`](./apps/web/public/models/README.md) if the house model's scale/position
needs tuning once viewed in-browser.

## Deployment (Vercel + Supabase)

Both apps deploy to Vercel as separate projects from this repo (Root Directory `apps/web` and `apps/admin`,
"Include source files outside of the Root Directory" enabled). Each only needs
`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Details in [`docs/SUPABASE.md`](./docs/SUPABASE.md).

Because `apps/web` is a static export, product and career detail pages are generated at build time. If new
slugs are added in the admin, redeploy the web project so those detail pages are generated.
