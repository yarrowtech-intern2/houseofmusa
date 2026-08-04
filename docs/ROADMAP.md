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

## Phase 3 — 3D Gallery

First-person walkthrough gallery: WASD + mouse-look (desktop), virtual joystick + swipe (mobile), `E` to
interact, frame glow/metadata on approach, camera zoom into project detail, footstep/ambient audio, bloom,
minimal UI. Admin: Gallery Frames management (assign products to frames/positions).

## Phase 4 — Careers

Job listings UI, role detail page, full application form (resume/cover-letter upload, LinkedIn/GitHub/
portfolio, salary, experience, skills, availability) wired to `POST /api/applications`. Admin: Applications
review/status pipeline, CareerRole CRUD.

## Phase 5 — Contact

Full glassmorphism booking modal wired to `POST /api/contacts`, validation + success animation (currently a
UI-only stub in `components/contact/ContactModal.tsx`).

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
