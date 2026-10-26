# Product Requirements — Haus of Musa

## What this is

An Awwwards-caliber marketing site for an enterprise IT company (ERP, SaaS, enterprise/custom software,
AI-ready infrastructure, digital transformation, cloud, web & mobile) built around a cinematic 3D "digital
headquarters" metaphor, plus a job-application/contact backend and an internal admin dashboard.

## Audience

- **Enterprise buyers / decision-makers** evaluating a software partner — need to feel confidence, scale,
  and craft within the first 10 seconds (hero).
- **Prospective hires** browsing careers and the product gallery.
- **Internal team** (admin dashboard) managing leads, applications, and content.

## Products (three deployables)

| App | Audience | Stack |
|---|---|---|
| `apps/web` | Public | Next.js App Router, R3F/Three.js, GSAP, Lenis |
| `apps/api` | Both apps | Express, MongoDB/Mongoose |
| `apps/admin` | Internal only | Next.js App Router, JWT auth |

## Success criteria (from the brief)

- Feels like Apple × Tesla × Nothing × Stripe × Linear — luxury, not flashy.
- Hero is a cinematic 3D experience: arrival sequence → camera approach → scroll-driven walkthrough of the
  headquarters, revealing Innovation / Technology / Engineering / Trust / Quality / Products / Future.
  See [ARCHITECTURE.md](./ARCHITECTURE.md#the-cinematic-home-page) for how this is implemented.
- A first-person 3D gallery is the signature secondary experience (careers/product showcase).
- 60fps mobile / 120fps desktop targets, Lighthouse 95+, graceful degradation on low-end devices.
- Full content lifecycle (products, jobs, applications, contacts) manageable without a code deploy.

## Phase status

This repo is mid-build. **Phase 1 (this pass)** — foundation, design system, the flagship cinematic home
page, route shells for every page, the API skeleton with auth, and an admin shell — is complete. Everything
else is sequenced in [ROADMAP.md](./ROADMAP.md). The full page-by-page requirements from the original brief
are preserved verbatim in `/prompt.md` at the repo root.
