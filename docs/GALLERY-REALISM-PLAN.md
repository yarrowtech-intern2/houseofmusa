# 3D Gallery Realism Plan

## Goal

Upgrade the `/gallery` experience from a procedural placeholder hall into a realistic, premium, first-person
product gallery while keeping it smooth on desktop and mobile.

The current implementation is intentionally lightweight:

- Route: `apps/web/src/app/gallery`
- UI/input: `apps/web/src/components/gallery`
- 3D scene: `apps/web/src/three/gallery`
- Spatial constants: `apps/web/src/lib/galleryLayout.ts`
- Current room: procedural primitives in `MuseumEnvironment.tsx`
- Existing model asset: `apps/web/public/models/gallery.glb`

## Target Direction

Realism should come from better assets, baked lighting, believable materials, and composed gallery details.
Avoid solving realism by adding many expensive realtime effects.

## Implementation Order

1. Load the real gallery model
   - Replace most procedural room geometry in `MuseumEnvironment.tsx` with `gallery.glb`.
   - Keep `galleryLayout.ts` as the source of truth for spawn, frame anchors, walk bounds, and interaction
     distances.
   - If `gallery.glb` scale/origin is wrong, fix in Blender first where possible, then fine-tune in code.

2. Bake realism into the asset
   - Add baked ambient occlusion, soft indirect shadows, and lightmaps in Blender.
   - Use runtime lights only for key/fill mood and picture lights.
   - Prefer baked detail over realtime shadow complexity.

3. Improve materials
   - Floor: marble/stone color, normal, and roughness maps. Keep reflection subtle, not mirror-like.
   - Walls: plaster texture with light variation.
   - Frames: beveled wood/metal materials.
   - Optional high-tier glass layer over art with very subtle reflection.

4. Replace placeholder art
   - Generate product poster/card textures for each frame.
   - Include product title, category, and a visual motif.
   - Keep frame textures small and compressed.
   - Avoid DOM overlays inside the 3D canvas for artwork.

5. Improve lighting composition
   - Add warm picture lights above frames.
   - Use soft ceiling/skylight illumination.
   - Reduce ambient intensity so corners, depth, and forms read properly.
   - Gate shadows/postprocessing by device tier.

6. Add architectural detail
   - Add baseboards, ceiling trims, wall panels, benches, plinths, plaques, and subtle floor seams.
   - Break up oversized empty walls.
   - Keep the space premium and sparse, not cluttered.

7. Refine movement and interaction
   - Slow walk speed slightly if the gallery feels game-like.
   - Add camera damping and very subtle body movement.
   - Improve collision beyond the current rectangular bounds if the real model needs it.
   - Make product focus feel like a smooth dolly toward the frame, with a clean return.

8. Apply performance tiers
   - High: bloom, soft shadows, subtle reflections, higher DPR.
   - Mid: baked lighting, limited bloom, lower reflection resolution.
   - Low/mobile: baked lighting only, no postprocessing, no live shadows, capped DPR.

9. Validate before calling it done
   - Test desktop and mobile viewports.
   - Walk the whole space and check controls.
   - Check frame focus/exit flow.
   - Verify no blank canvas, no clipping through major geometry, no unreadable art.
   - Measure FPS and first-load size.

## Performance Budget

- Keep the gallery model compressed.
- Prefer Meshopt/Draco for geometry compression.
- Use compressed textures where the deployment pipeline supports them.
- Keep poster textures modest; avoid large uncompressed images.
- Do not add many dynamic lights with shadows.
- Keep hot-path proximity checks outside React state where possible.

## Definition Of Done

- The gallery no longer reads as a flat primitive room.
- The space has believable materials, lighting, scale, and architectural detail.
- Product frames look intentionally designed, not like color placeholders.
- Movement remains smooth on low/mid devices.
- The page still works as a dynamic Next route on the public web service.
