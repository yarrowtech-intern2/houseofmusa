# Supabase backend & Vercel deployment

The Express + MongoDB API (`apps/api`) was replaced by a single Supabase project. Nothing runs server-side
except Next.js on Vercel.

| Concern | Where it lives |
|---|---|
| Database | Postgres — schema in [`supabase/migrations`](../supabase/migrations) |
| Access control | Row Level Security on every table; no service-role key in any app |
| Admin login | Supabase Auth (email + password). A user is an admin only if they have a row in `admin_profiles` |
| Uploads | Storage buckets `media` (public, admin-write) and `applications` (private, anyone-can-upload, admin-read via signed URLs) |
| Dashboard numbers | SQL functions `dashboard_summary()` / `analytics_summary()` (admin only) |
| Contact / application analytics events | Postgres triggers, so they can't be forged from the browser |
| Data access in code | [`packages/data`](../packages/data) (`@hausofmusa/data`) — used by both apps |

## One-time Supabase setup

1. Create a project at supabase.com.
2. Run the schema: Dashboard → SQL Editor → paste `supabase/migrations/20261014000000_init.sql` → Run.
   (Or with the CLI: `supabase link --project-ref <ref>` then `supabase db push`.)
3. Copy **Project URL** and the **anon** key (Project Settings → API) into `apps/web/.env.local` and
   `apps/admin/.env.local`. Copy the **service_role** key into `supabase/.env` (never anywhere else).
4. Seed: `pnpm seed:admin <email> <password> "<name>"`, `pnpm seed:products`, `pnpm seed:career-roles`.
5. Authentication → Providers → Email: turn **off** "Allow new users to sign up". Admin accounts are created
   with `seed:admin`; leaving sign-up open would let anyone create an auth user (they still wouldn't be an
   admin, but there is no reason to allow it).

## Vercel

Create two projects from the same repo:

| Project | Root Directory | Env vars |
|---|---|---|
| web | `apps/web` | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, optional `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ADMIN_URL` |
| admin | `apps/admin` | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, optional `NEXT_PUBLIC_WEB_URL` |

Enable "Include source files outside of the Root Directory" so the workspace packages resolve. Each app's
`vercel.json` sets the install/build commands. Then add the admin's Vercel URL to Supabase → Authentication →
URL Configuration (Site URL / redirect URLs).

## Behaviour changes vs. the old API

- **No rate limiting** on the public forms (contact, applications, analytics). The old Express API limited
  writes to 20 / 15 min per IP. Column `CHECK` constraints and storage size/MIME limits still bound what can be
  written, but if spam shows up add Cloudflare Turnstile or move the three public inserts behind an Edge
  Function.
- **Ids are UUIDs** (the UI still reads them as `_id`).
- **Application files** are stored as paths in the private bucket; the admin Applications page turns them into
  1-hour signed links.
- **Search** on products/contacts is case-insensitive substring matching (`ilike`), not Mongo text search.
- Existing MongoDB data was not migrated (fresh start).
