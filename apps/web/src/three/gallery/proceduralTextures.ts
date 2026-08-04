import * as THREE from "three";

/**
 * Canvas-generated textures — no image assets. Cheap to build once (called
 * from a `useMemo` in MuseumEnvironment, not per-frame) and reused across
 * all the meshes that need them.
 */

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

export function createMarbleTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const rand = seededRandom(42);

  ctx.fillStyle = "#e9e6e0";
  ctx.fillRect(0, 0, size, size);

  // Veining — soft curved strokes at varying opacity.
  for (let i = 0; i < 14; i++) {
    ctx.beginPath();
    const startX = rand() * size;
    const startY = rand() * size;
    ctx.moveTo(startX, startY);
    const cp1x = startX + (rand() - 0.5) * size * 0.8;
    const cp1y = startY + (rand() - 0.5) * size * 0.8;
    const endX = rand() * size;
    const endY = rand() * size;
    ctx.quadraticCurveTo(cp1x, cp1y, endX, endY);
    ctx.strokeStyle = `rgba(150, 140, 125, ${0.08 + rand() * 0.14})`;
    ctx.lineWidth = 0.6 + rand() * 2.2;
    ctx.stroke();
  }

  // Fine grain speckle.
  for (let i = 0; i < 2200; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const shade = rand() > 0.5 ? 255 : 120;
    ctx.fillStyle = `rgba(${shade}, ${shade}, ${shade * 0.95}, ${rand() * 0.05})`;
    ctx.fillRect(x, y, 1, 1);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createPlasterTexture(baseColor = "#f2f0ec"): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const rand = seededRandom(7);

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 3000; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const shade = rand() > 0.5 ? 255 : 90;
    ctx.fillStyle = `rgba(${shade}, ${shade}, ${shade}, ${rand() * 0.035})`;
    ctx.fillRect(x, y, 1, 1);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
