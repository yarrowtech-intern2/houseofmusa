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

## Phase 3 — 3D Gallery (done)

- First-person walkthrough at `/gallery` (`apps/web/src/app/gallery`, a standalone route outside the
  `(site)` group — full-bleed, no nav/footer/Lenis). Desktop: WASD + pointer-lock mouse-look. Mobile: virtual
  joystick + drag-to-look, both hand-rolled (see `components/gallery/`).
  - `E` (desktop) / tap (mobile) opens a product detail panel when within range of a frame; a GSAP camera
    tween zooms toward the frame on open and eases back to the player on close (`Esc` or the close button).
  - The room ("balcony museum" — a grand hall with a non-walkable mezzanine ring) is **fully procedural**,
    not a loaded model — primitive geometry + canvas-generated marble/plaster textures, built once in
    `MuseumEnvironment.tsx`. `gallery.glb` is no longer used by this route (still on disk, just unreferenced)
    — this was a deliberate pivot from the first pass, for full control over scale/look and one fewer
    network fetch (~1.9MB) on load.
  - 8 frames positioned around the room's perimeter (`lib/galleryLayout.ts`, realistic scale — 1 unit ≈ 1m),
    one per seeded product, each with real molding, a museum label plaque, its own picture-light spotlight,
    and a proximity-based emissive glow computed per-frame in its own `useFrame` — no React state/re-renders
    on the hot path.
  - Collision is a simple rectangular walk boundary, not per-mesh against the room's geometry — a deliberate
    first-pass tradeoff, tighten later if it looks off in-browser.
  - No audio (footsteps/ambient) — no real audio assets exist yet and synthesizing convincing ones wasn't
    worth the effort for a placeholder pass; drop files in and wire them up whenever real audio exists.
- Admin Gallery Frames management (assigning specific products to specific frame positions) wasn't built —
  frames currently map to products by seed order (`order` field, cycling if fewer than 8 products exist).
  Worth adding once frame-to-product assignment needs to be independent of that.

- Visual realism upgrade plan: [GALLERY-REALISM-PLAN.md](./GALLERY-REALISM-PLAN.md).

## Phase 4 — Careers (done)

- Careers list (`/careers`) and role detail (`/careers/[slug]`, re-added now that real `CareerRole`
  documents exist to satisfy static export's `generateStaticParams` requirement) — 6 placeholder roles
  seeded across Engineering/Design/Sales/People (`apps/api/src/scripts/seedCareerRoles.ts`), clearly generic
  copy, swap via the admin CRUD once real openings exist.
- Full application form (`components/careers/ApplicationForm.tsx`) embedded on the role detail page —
  resume (required) + cover letter (optional) upload, LinkedIn/GitHub/portfolio, expected salary, experience,
  comma-separated skills, availability. Submits as `FormData` directly from the browser to
  `POST /api/applications` (not through a Next.js server action — stays compatible with static export, since
  it's a client-side fetch at runtime, not a build-time concern).
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
- Respects the `CAN_USE_API` fallback pattern (`lib/api.ts`) the rest of the site now uses for
  static-placeholder deploys: when no real API is configured in production, the modal falls back to the
  original "email us directly" content instead of rendering a form with nowhere to submit.
- Admin **Contacts** list is still a placeholder — deliberately left for phase 6, which already scopes the
  search/filter/CSV export work it needs; `GET /api/contacts` has worked since phase 1.
- Verified with a real submission through the live API (not just a page-render check) — write, admin-side
  read, then cleaned up the test record.

## Phase 6 — Admin depth

Analytics ingestion (page views, conversions) + charts, CSV export, media library with upload, homepage
content editor (headline/story-section copy without a deploy), statistics dashboards.

## Phase 7 — SEO

`sitemap.xml`, `robots.txt`, JSON-LD (Organization, Product, JobPosting schemas), per-route OpenGraph/
Twitter cards, canonical URLs, image SEO.

## Phase 8 — Accessibility

Full ARIA audit, keyboard navigation through the 3D gallery, `prefers-reduced-motion` verification across
every animated surface (baseline support already exists — see ARCHITECTURE.md).

## Phase 9 — Deployment

Render service configs for `web`/`admin`/`api`, environment/secrets strategy, VPS-compatible Dockerfiles,
production Mongo Atlas setup.
