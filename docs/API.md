# REST API — `apps/api`

Base URL: `http://localhost:4000` in dev. All admin-only routes require the `hom_admin_token` httpOnly
cookie (set by `/api/auth/login`) or an `Authorization: Bearer <token>` header.

Security middleware applied globally: `helmet`, `cors` (origin allowlist via `CORS_ORIGINS` env),
`compression`, `morgan` logging, a global rate limiter (300 req/15min), and a stricter write-route limiter
(20 req/15min) on public submission endpoints. All request bodies validated with Zod
(`packages/schemas`) before hitting a controller; failures return `400` with `fieldErrors`.

## Auth

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/api/auth/login` | — | `{ email, password }` → sets cookie, returns `{ token, admin }` |
| POST | `/api/auth/logout` | — | Clears cookie |
| GET | `/api/auth/me` | admin | Returns the decoded token payload |

## Contacts

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/api/contacts` | — | Consultation form submission (rate-limited) |
| GET | `/api/contacts` | admin | Paginated (`page`, `pageSize`) |

## Products

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/products` | — | Paginated (`pageSize` max 50), filterable by `category`, full-text `search`. Published only. |
| GET | `/api/products/:slug` | — | Published only |
| GET | `/api/products/admin` | admin | Same filters as above, but includes unpublished (draft) products |
| GET | `/api/products/admin/:id` | admin | Fetch by Mongo `_id` regardless of published status (used by the edit form) |
| POST | `/api/products` | admin | Rejects duplicate `slug` with `409` |
| PATCH | `/api/products/:id` | admin | Partial update (`productUpdateSchema` — all fields optional); re-checks `slug` uniqueness if changed |
| DELETE | `/api/products/:id` | admin | `204` on success |

## Career Roles

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/career-roles` | — | Published only |
| GET | `/api/career-roles/:slug` | — | Published only |
| GET | `/api/career-roles/admin` | admin | Includes unpublished (draft) roles |
| GET | `/api/career-roles/admin/:id` | admin | Fetch by Mongo `_id` regardless of published status (used by the edit form) |
| POST | `/api/career-roles` | admin | Rejects duplicate `slug` with `409` |
| PATCH | `/api/career-roles/:id` | admin | Partial update (`careerRoleUpdateSchema`); re-checks `slug` uniqueness if changed |
| DELETE | `/api/career-roles/:id` | admin | `204` on success |

## Applications

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/api/applications` | — | `multipart/form-data`: `resume` (required), `coverLetter` (optional), plus form fields. `skills` accepts a JSON array string or comma-separated string. Rate-limited. |
| GET | `/api/applications` | admin | Paginated, populates `roleId` → `{ _id, title, department }` |
| PATCH | `/api/applications/:id/status` | admin | Body: `{ status }`, one of `applicationStatusValues` (new/reviewing/interviewing/offered/rejected/hired) |

## Settings

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/settings/public` | public | Public settings payload with defaults for homepage content, contact details, gallery frames, and SEO. |
| GET | `/api/settings/admin` | admin | Same normalized payload plus raw stored setting documents. |
| GET | `/api/settings/:key` | public | Fetch one setting, falling back to defaults. Keys: `homepage-content`, `contact-details`, `gallery-frames`, `seo`. |
| PATCH | `/api/settings/:key` | admin | Upserts one setting. Body can be the setting object or `{ value }`; validated by `@houseofmusa/schemas`. |

## Media

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/media` | admin | Lists uploaded media. Optional `category` filter. |
| POST | `/api/media` | admin | Creates a media registry row for an already-hosted URL. |
| POST | `/api/media/upload` | admin | `multipart/form-data`: `file` plus optional `category` (`product`, `gallery-frame`, `homepage`, `misc`). Accepts images, GLB/GLTF, and Lottie files up to 25MB. |
| DELETE | `/api/media/:id` | admin | Deletes the media row and removes local uploaded files when applicable. |

## Static

Uploaded files served from `/uploads/*` (disk storage under `apps/api/uploads/`, gitignored).

## Not yet built (see [ROADMAP.md](./ROADMAP.md))

Sitemap/robots generation, JSON-LD, keyboard-only gallery traversal audit, and production deployment configs.
