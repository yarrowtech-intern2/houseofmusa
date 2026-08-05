/**
 * Spatial layout for gallery2.glb. Frame anchors match the Blender empties
 * named album1..album8. Units are the model's exported meter-scale units.
 */

export const ROOM = {
  halfWidth: 14.3,
  halfDepth: 8.25,
  centerZ: -8.31,
  wallHeight: 9.5,
  balconyHeight: 4.6,
  balconyDepth: 1.8,
};

export const EYE_HEIGHT = 3.2;

export const WALK_BOUNDS = {
  minX: -11.8,
  maxX: 11.8,
  minZ: -14.4,
  maxZ: -2.1,
};

export const SPAWN_POSITION: [number, number, number] = [0, EYE_HEIGHT, ROOM.centerZ];
export const SPAWN_YAW = Math.PI;

export interface FrameAnchor {
  position: [number, number, number];
  /** Radians: frame normal and camera viewing direction. */
  rotationY: number;
}

export const FRAME_ANCHORS: FrameAnchor[] = [
  { position: [6.058, 5.291, -0.242], rotationY: Math.PI }, // album1
  { position: [0.757, 5.291, -0.242], rotationY: Math.PI }, // album2
  { position: [-3.667, 5.291, -0.242], rotationY: Math.PI }, // album3
  { position: [-7.841, 5.291, -0.242], rotationY: Math.PI }, // album4
  { position: [-7.841, 5.291, -16.322], rotationY: 0 }, // album5
  { position: [-3.667, 5.291, -16.322], rotationY: 0 }, // album6
  { position: [0.757, 5.291, -16.322], rotationY: 0 }, // album7
  { position: [6.058, 5.291, -16.322], rotationY: 0 }, // album8
];

export const INTERACT_DISTANCE = 4.1;
export const MOVE_SPEED = 4.4;
export const FRAME_GLOW_RADIUS = 8.5;
export const FRAME_VIEW_DISTANCE = 3.1;
