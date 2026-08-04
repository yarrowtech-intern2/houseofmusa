# Architecture

## Monorepo layout

```
houseofmusa/
  apps/
    web/     Next.js 14 App Router — public marketing site
    admin/   Next.js 14 App Router — internal dashboard, separate deploy target
    api/     Express + TypeScript + Mongoose — REST API used by both
  packages/
    ui/       shared shadcn-style components + design tokens (Button, Input, Dialog, Card, Badge…)
    types/    shared TS interfaces mirroring the Mongo collections
    schemas/  shared Zod schemas — single source of validation truth for both the API and web/admin forms
    config/   shared Tailwind preset (colors/type scale/shadows) consumed by both Next apps
  docs/       this folder — living documentation, updated alongside the code
```

pnpm workspaces, no build step for shared packages — `transpilePackages` in each Next app's config lets them
consume `packages/*` TypeScript source directly. `apps/api` compiles with `tsc` for production, runs on `tsx`
in dev.

## The cinematic home page

`apps/web/src/app/(site)/page.tsx` is a server component that does one thing: checks whether
`public/models/house.glb` exists (`fs.existsSync`) and passes that boolean into `HomeExperience` (the real
file is in place; the fallback still exists for anyone who strips it out locally). Everything else is
client-side, orchestrated in
[`components/home/HomeExperience.tsx`](../apps/web/src/components/home/HomeExperience.tsx):

1. **`ArrivalSequence`** — near-black loader, canvas2D ambient particles, logo fade, word-by-word headline
   reveal. Locks `document.body` scroll for its duration so it can never race the camera timeline. Calls
   `onComplete` when done, which flips `ready = true`.
2. **`HeroCanvas`** (`three/scenes/HeroCanvas.tsx`) — a `position: fixed` R3F `<Canvas>` behind everything,
   for the full scroll length of the page (hero + all 7 story sections). Loaded via `next/dynamic` with
   `ssr: false` — R3F/WebGL cannot run server-side.
   - `HeadquartersModel` renders the real `.glb` via `useGLTF` if `hasModel` is true, otherwise
     `PlaceholderMonument` (procedural geometry) — see `apps/web/public/models/README.md` for the drop-in
     contract.
   - `useCameraTimeline` (`three/hooks/`) drives the camera with GSAP: an intro tween (far → hero-rest) that
     fires once `ready` flips true, then a `ScrollTrigger`-scrubbed timeline through one waypoint per story
     section. Mouse parallax and an idle "breathing" drift are layered additively onto the `lookAt` target in
     `useFrame`, never onto the GSAP-driven state, so they can't fight the scroll timeline.
   - Device-tier gating (`hooks/useDeviceTier.ts`) drops DPR, disables postprocessing/shadows/particles on
     low-end hardware; `prefers-reduced-motion` skips all cinematic tweens and snaps to end states.
3. **`StorySection` × 7** — glass panels scrolling over the fixed canvas, each with its own `RevealText`
   scroll-triggered reveal, independent of the camera timeline but reading the same scroll position.

## Motion primitives (`apps/web/src/components/motion`)

- `SmoothScrollProvider` — Lenis synced to GSAP's ticker and `ScrollTrigger.update`, the app-wide scroll
  engine.
- `RevealText` — word/char stagger reveal. Does its own splitting rather than the paid GSAP `SplitText`
  plugin; swap in `SplitText` here if the project acquires a Club GSAP license.
- `MagneticButton`, `ParallaxLayer` — reusable hover/scroll primitives used across CTAs and content sections.

All GSAP effects use `gsap.context()` + `.revert()` on cleanup (React effect teardown) to avoid leaking
tweens/ScrollTriggers across navigations.

## API structure (`apps/api/src`)

`config` (env validation via Zod, Mongo connection) → `models` (8 Mongoose schemas) → `middleware`
(helmet/cors/compression/morgan, rate limiting, Zod `validateBody`/`validateQuery`, JWT `requireAuth`,
`multer` upload) → `controllers` → `routes`, assembled in `app.ts`. See [API.md](./API.md) for the endpoint
list and [DATABASE.md](./DATABASE.md) for schemas.

## Admin app (`apps/admin`)

Separate Next.js app/deploy target. Auth is a `POST /api/auth/login` call that sets an httpOnly cookie;
`(dashboard)/layout.tsx` is a server component that calls `getServerSession()` (forwards the cookie to
`/api/auth/me`) and redirects to `/login` if unauthenticated. Sidebar covers all ten sections from the brief
(Analytics, Contacts, Job Applications, Products, Gallery Frames, Homepage Content, Media, Statistics, SEO,
Website Analytics) as real routes; most render `SectionPlaceholder` until their follow-up phase lands (see
[ROADMAP.md](./ROADMAP.md)). Dark mode via `next-themes`.
