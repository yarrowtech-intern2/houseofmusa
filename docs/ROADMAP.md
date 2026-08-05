# Roadmap

## Phase 1 — Foundation (done)

Monorepo, design system, the cinematic home page (arrival sequence, 3D hero with placeholder building,
GSAP camera timeline, 7 story sections), route shells for every page, the API skeleton (all 8 collections,
auth, contacts/products/career-roles/applications endpoints), and an admin shell (login, protected layout,
all 10 sidebar sections as routes).

## Phase 2 — About & Products (done)

- About page: mission/vision/values, timeline, animated stat counters, horizontal-reveal "why choose us"
  cards. Leadership section is role-only by design (no fabricated names/bios) until real ones exist.
- Products page: all 8 seeded products, client-side search + category filter, tilt-on-hover cards with a
  brand-gradient placeholder cover (no stock images used).
- Product detail page: description, tech stack, case study/live demo/GitHub links (shown only when present).
- Admin: full Products CRUD (create/edit/delete/publish toggle) at `/products`, `/products/new`,
  `/products/[id]`, wired to the API's new admin endpoints.
- API: added `GET /api/products/admin`, `GET /api/products/admin/:id`, `PATCH /api/products/:id`,
  `DELETE /api/products/:id` (see [API.md](./API.md)).
- Product content is placeholder copy (`apps/api/src/scripts/seedProducts.ts`) — swap via the admin CRUD
  once real product details exist.

## Phase 3 - 3D Gallery (done)

- First-person walkthrough at `/gallery` (`apps/web/src/app/gallery`, a standalone route outside the `(site)` group). Desktop uses WASD/arrow keys plus pointer-lock mouse-look. Mobile uses a centered compact analog controller plus full-screen drag-to-look.
- The environment now loads `gallery2.glb` with local Draco decoder assets. Product cards hang from Blender empties named `album1` through `album8`.
- `E` (desktop) / `View` (mobile) opens a product detail panel when within range of a frame; a GSAP camera tween zooms toward the frame and eases back to the player on close.
- Admin Gallery Frames management is built: `/gallery-frames` assigns products to the eight album anchors and `/gallery` consumes that configured product order when settings exist.
- Collision is still a simple rectangular walk boundary, not per-mesh against the gallery model.
- No audio yet; add real ambient/footstep assets before wiring sound.

- Visual realism upgrade plan: [GALLERY-REALISM-PLAN.md](./GALLERY-REALISM-PLAN.md).
## Phase 4 — Careers (done)

- Careers list (`/careers`) and role detail (`/careers/[slug]`) — 6 placeholder roles
  seeded across Engineering/Design/Sales/People (`apps/api/src/scripts/seedCareerRoles.ts`), clearly generic
  copy, swap via the admin CRUD once real openings exist.
- Full application form (`components/careers/ApplicationForm.tsx`) embedded on the role detail page —
  resume (required) + cover letter (optional) upload, LinkedIn/GitHub/portfolio, expected salary, experience,
  comma-separated skills, availability. Submits as `FormData` directly from the browser to
  `POST /api/applications` directly from the browser.
- Admin: full CareerRole CRUD (`/career-roles`, `/career-roles/new`, `/career-roles/[id]`) mirroring the
  Products admin pattern; Applications review (`/applications`) with resume/cover-letter download links and
  a per-row status dropdown (new → reviewing → interviewing → offered/rejected/hired) wired to the new
  `PATCH /api/applications/:id/status`.
- API additions: `GET/POST /api/career-roles(/admin)`, `PATCH`/`DELETE /api/career-roles/:id`,
  `PATCH /api/applications/:id/status` (see [API.md](./API.md)).
- Verified with a real end-to-end submission through the live API (multipart upload, Atlas write, admin
  list/status-update read), not just page-render checks — then cleaned up the test record.

## Phase 5 — Contact (done)

- `components/contact/ContactModal.tsx` now does the real thing: React Hook Form + `contactSchema`
  (`@houseofmusa/schemas`, shared with the API, so client and server validation can't drift), full field set
  (name, email, phone, company, budget, project type, message), submits directly to `POST /api/contacts`,
  success state (checkmark + message) instead of closing immediately, form resets on reopen so a second visit
  never shows a stale success screen.
- Respects the `CAN_USE_API` fallback pattern (`lib/api.ts`): when no real API is configured in production,
  the modal falls back to the original "email us directly" content instead of rendering a form with nowhere
  to submit.
- Admin **Contacts** list is still a placeholder — deliberately left for phase 6, which already scopes the
  search/filter/CSV export work it needs; `GET /api/contacts` has worked since phase 1.
- Verified with a real submission through the live API (not just a page-render check) — write, admin-side
  read, then cleaned up the test record.

## Phase 6 — Admin depth (mostly done)

- Admin dashboard summary, contacts, statistics, and website analytics pages are wired to API data.
- Homepage Content editor persists hero copy, story-section copy, CTAs, and contact details via
  `/api/settings/*`; the public home page/footer consume those settings with static fallbacks.
- Gallery Frames editor assigns products to `album1` through `album8`; `/gallery` consumes the configured
  product order when settings exist.
- Media Library uploads images/models/Lottie files to `/uploads/media` and records them in the `Media`
  collection.
- Still remaining: CSV export for non-contact resources and deeper analytics charts/conversion funnels.

## Phase 7 — SEO (partial)

Admin SEO settings now persist default metadata and per-route snippets; the public root metadata consumes the
default title/description/OpenGraph image. Still remaining: `sitemap.xml`, `robots.txt`, JSON-LD
(Organization, Product, JobPosting schemas), canonical URLs, and image SEO.

## Phase 8 — Accessibility

Full ARIA audit, keyboard navigation through the 3D gallery, `prefers-reduced-motion` verification across
every animated surface (baseline support already exists — see ARCHITECTURE.md).

## Phase 9 — Deployment

Render service configs for `web`/`admin`/`api`, environment/secrets strategy, VPS-compatible Dockerfiles,
production Mongo Atlas setup.

