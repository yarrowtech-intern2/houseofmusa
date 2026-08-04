/**
 * Spatial layout for the fully procedural 3D museum (see
 * three/gallery/MuseumEnvironment.tsx) — no external model, so these
 * numbers are the actual source of truth for the room's geometry, not
 * derived from inspecting an asset. Units are meters.
 *
 * Rectangular hall, 22m × 32m, centered on the origin:
 *   North/south walls (short, 22m) each hold 2 frames.
 *   East/west walls (long, 32m) each hold 2 frames.
 * A non-walkable balcony/mezzanine rings the room at ~4.6m for visual
 * grandeur ("balcony museum") — walkable second-level traversal (stairs,
 * elevation changes) is a bigger control-system change than this pass
 * covers; the balcony is architectural, not a second play area, for now.
 */

export const ROOM = {
  halfWidth: 11, // x: -11..11
  halfDepth: 16, // z: -16..16
  wallHeight: 9,
  balconyHeight: 4.6,
  balconyDepth: 1.8, // how far the mezzanine shelf protrudes inward from the walls
};

export const EYE_HEIGHT = 1.7;

export const WALK_BOUNDS = {
  minX: -9.3,
  maxX: 9.3,
  minZ: -14.3,
  maxZ: 14.3,
};

export const SPAWN_POSITION: [number, number, number] = [0, EYE_HEIGHT, 0];
export const SPAWN_YAW = 0;

export interface FrameAnchor {
  position: [number, number, number];
  /** Radians — which way the frame faces (and the direction visitors approach from). */
  rotationY: number;
}

const FRAME_Y = 1.6; // museum-standard hang height: art center ~1.5-1.6m off the floor

export const FRAME_ANCHORS: FrameAnchor[] = [
  { position: [-4, FRAME_Y, ROOM.halfDepth], rotationY: Math.PI }, // north wall
  { position: [4, FRAME_Y, ROOM.halfDepth], rotationY: Math.PI },
  { position: [ROOM.halfWidth, FRAME_Y, -7], rotationY: -Math.PI / 2 }, // east wall
  { position: [ROOM.halfWidth, FRAME_Y, 7], rotationY: -Math.PI / 2 },
  { position: [4, FRAME_Y, -ROOM.halfDepth], rotationY: 0 }, // south wall
  { position: [-4, FRAME_Y, -ROOM.halfDepth], rotationY: 0 },
  { position: [-ROOM.halfWidth, FRAME_Y, 7], rotationY: Math.PI / 2 }, // west wall
  { position: [-ROOM.halfWidth, FRAME_Y, -7], rotationY: Math.PI / 2 },
];

export const INTERACT_DISTANCE = 3.4;
export const MOVE_SPEED = 4.4; // m/s — brisk but comfortable walking pace
export const FRAME_GLOW_RADIUS = 8.5;
export const FRAME_VIEW_DISTANCE = 2.4; // camera stand-off distance when viewing a piece
