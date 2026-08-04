# 3D Models

- `house.glb` — the headquarters model used in the cinematic home page hero
  (`three/components/HeadquartersModel.tsx`). Loaded automatically since the
  file is present; `app/(site)/page.tsx` checks for it via `fs.existsSync`
  and falls back to a procedural placeholder if it's ever removed.
- `gallery.glb` — the gallery environment, for the first-person 3D gallery
  (`docs/ROADMAP.md` phase 3). Not wired up yet.

## Tuning the real house model

The export's scale/origin hasn't been reviewed in-browser yet. If it looks
too large/small or off-center against the camera waypoints:
- Adjust `scale`/`position` on the `<primitive>` in `HeadquartersModel.tsx`.
- Adjust `CAMERA_WAYPOINTS` in `three/hooks/useCameraTimeline.ts` — those
  positions/lookAt targets were tuned against the placeholder box and will
  likely need re-tuning against the real geometry's actual bounding box.
