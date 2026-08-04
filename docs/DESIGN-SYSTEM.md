# Design System

Defined once in `packages/config/tailwind-preset.js`, consumed by both `apps/web` and `apps/admin`.

## Color tokens

| Token | Value | Use |
|---|---|---|
| `primary` | `#FF6F00` | CTAs, active states, brand accent |
| `secondary` | `#2F78ED` | Links, secondary accents |
| `background` | `#EBEBEB` | Page background |
| `foreground` | `#111111` | Body text |
| `surface` | `#FFFFFF` / `#F5F5F3` | Cards, panels |
| `glass.light` / `glass.dark` | `rgba(255,255,255,.6)` / `rgba(17,17,17,.5)` | Glassmorphism surfaces (nav, dialogs, story panels) |

No neon, no cyberpunk gradients — accent is glass/blur/soft-shadow, not saturated color.

## Logo

Two raster variants, `logo-black.png` and `logo-white.png`, in `public/logo/` of both `apps/web` and
`apps/admin`. Usage isn't automatic-theme-driven on the public site (it has no dark mode) — components pick
the variant that matches their fixed context: black in `SiteNav`/`SiteFooter` (light glass/surface), white
in `ArrivalSequence` (near-black loader). `apps/admin` does have a real light/dark toggle, so its
`components/layout/Logo.tsx` renders both and swaps visibility with Tailwind's `dark:` variant.

## Typography

- **Display**: Manrope (`--font-display`) — headlines, oversized cinematic type.
- **Body**: Inter (`--font-sans`) — everything else.
- Fluid, `clamp()`-based scale: `text-display-2xl` (hero, ~144px desktop) down to `text-display-md`
  (section headings, ~40px desktop), all with tight tracking (`-0.01em` to `-0.02em`) for an Apple-like feel.

## Motion language

- Cinematic easing curve: `cubic-bezier(0.16, 1, 0.3, 1)` (`ease-cinematic` in Tailwind config).
- Word-by-word / char-by-char masked reveals (`RevealText`, see ARCHITECTURE.md) — no hard cuts, everything
  dissolves or slides in.
- Glass panels (`bg-glass-light backdrop-blur-xl`) are the default surface for anything overlaying the 3D
  scene or imagery.

## Shared component library (`packages/ui`)

Hand-built shadcn-style primitives (cva + Radix + `cn()` via `clsx`/`tailwind-merge` — the same pattern the
shadcn CLI generates, written directly rather than run interactively): `Button` (primary/secondary/outline/
ghost/glass variants), `Input`/`Textarea`, `Label`, `Card`, `Badge`, `Separator`, `Dialog`. Extend this set
here rather than duplicating primitives per-app.
