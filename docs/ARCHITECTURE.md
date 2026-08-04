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

## 3D Gallery (`apps/web/src/app/gallery`, `three/gallery/`, `components/gallery/`)

Standalone route — deliberately **outside** the `(site)` route group, so it gets none of `SiteNav`/
`SiteFooter`/`SmoothScrollProvider` (a full-bleed first-person view has no business sharing a scroll engine
or nav chrome with the rest of the site). `app/gallery/page.tsx` fetches products server-side and hands them
to `GalleryExperience` (client component, dynamically imports `GalleryScene` with `ssr: false`).

- **`FirstPersonRig`** (lives inside the `<Canvas>`) drives both control schemes from one `useFrame` loop:
  desktop keyboard + Pointer Lock API mouse-look, or mobile touch (a hand-rolled `VirtualJoystick` for
  movement, a full-screen `TouchLookArea` drag surface for camera rotation — both DOM components outside the
  canvas, coordinating through plain refs, not React state, so 60fps input never triggers a re-render).
  Player position/orientation live in refs owned by `GalleryScene` and passed down, not owned by the rig
  itself — `GalleryFrame` and the interaction camera tween both need to read them too.
- **`GalleryFrame`** computes its own proximity-based emissive glow every frame by reading the shared
  player-position ref directly — no lifted React state, which would mean a re-render for every frame on
  every movement tick.
- **`InteractionCameraTween`** takes over from the rig (which checks a `paused` flag and no-ops) to GSAP-tween
  the camera toward a frame on interact and back to the player on close — flat numeric tween targets
  (`{x,y,z,yaw,pitch}`), the same pattern as the home hero's camera timeline, for the same reason (GSAP
  doesn't reliably tween array/Vector3-shaped properties in one call).
- **`MuseumEnvironment`** — the room itself is fully procedural (primitive geometry, no `.glb`), built once
  via `useMemo`/plain JSX rather than loaded over the network: marble floor (`MeshReflectorMaterial`, gated
  by device tier), plaster walls, a recessed ceiling skylight strip, a non-walkable balcony/mezzanine ring
  with a frosted-glass railing for the "balcony museum" read, and columns along the long walls. Textures
  (`proceduralTextures.ts`) are canvas-generated at runtime — marble veining and plaster grain via seeded
  pseudo-random noise — so there are zero image assets for the environment. Room dimensions, the walk
  boundary, and all 8 frame anchors live in one place, `lib/galleryLayout.ts`, at realistic human scale
  (1 unit ≈ 1 meter, eye height 1.7m). Collision is a simple rectangular bound, not per-mesh.
- Each **`GalleryFrame`** has real molding geometry, a museum-style label plaque, and its own `spotLight`
  aimed at the artwork via an explicit `object3D` target (the naive `target-position` dash-prop doesn't work
  here — a `SpotLight.target` is a separate Object3D that has to be parented/wired to actually inherit the
  frame group's transform, not just assigned a position). Proximity glow is computed independently per-frame
  in its own `useFrame`, reading a shared player-position ref — no lifted React state on that hot path.
- No audio yet — see [ROADMAP.md](./ROADMAP.md#phase-3--3d-gallery-done).

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

## Static export

`apps/web` builds with `output: "export"` (`next.config.mjs`) — no Node server on the host; it's deployed as
a static site (Render Static Site), with the API on a separate VPS. Consequences worth knowing:

- Every dynamic route needs `generateStaticParams` (`products/[slug]` fetches all product slugs at build
  time). **Next requires it to resolve to at least one entry** — an empty array makes the build fail with a
  (confusingly-worded) "missing `generateStaticParams()`" error, not a silent zero-page skip. This is why
  `careers/[slug]` doesn't exist right now: there are no `CareerRole` documents yet, so it has nothing to
  return. Re-add it once Phase 4 seeds real roles.
- Content edited via the admin dashboard (products, eventually careers) only appears on the live site after
  a rebuild — there's no server left to re-fetch on request. A rebuild-on-publish webhook from the API is a
  reasonable follow-up once that becomes annoying.
- `next/image` is never used anywhere in `apps/web` (plain `<img>` throughout) specifically so this doesn't
  also require `images: { unoptimized: true }` — the built-in optimizer needs a server and errors under
  `output: "export"` otherwise.
- `NEXT_PUBLIC_API_URL` must be reachable from wherever the build runs (Render's build environment), not just
  from end users' browsers — it's read at build time for every server-fetched page.

## Admin app (`apps/admin`)

Separate Next.js app/deploy target. Auth is a `POST /api/auth/login` call that sets an httpOnly cookie;
`(dashboard)/layout.tsx` is a server component that calls `getServerSession()` (forwards the cookie to
`/api/auth/me`) and redirects to `/login` if unauthenticated. Sidebar covers the ten sections from the brief
(Analytics, Contacts, Job Applications, Products, Gallery Frames, Homepage Content, Media, Statistics, SEO,
Website Analytics) plus **Career Roles** — added because the brief's admin section list didn't actually
include job-posting management, even though the Careers page section explicitly calls for "admin can post
jobs"; "Job Applications" alone only covers reviewing candidate submissions, a distinct workflow from
authoring the postings themselves. Products and Career Roles have full working CRUD; the rest render
`SectionPlaceholder` until their follow-up phase lands (see [ROADMAP.md](./ROADMAP.md)). Dark mode via
`next-themes`.
