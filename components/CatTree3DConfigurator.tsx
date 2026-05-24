"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import {
  CARPET_COLORS,
  PLATFORM_NAMES,
  MIN_PLATFORMS,
  MAX_PLATFORMS,
  PRICE_PER_PLATFORM,
  SHIPPING_FLAT_RATE,
  getPrice,
  formatCurrency,
} from "@/lib/products";

// ── Constants ─────────────────────────────────────────────────────────────────
const BASE_HEIGHT = 0.12;
const BASE_RADIUS = 0.62;
const PLATFORM_THICKNESS = 0.12;
const FIRST_PLATFORM_RISE = 0.38;

// Anchor points where branches emerge from the base ring
const BASE_ANCHORS = [
  { x: 0.06, z: 0.04 },
  { x: 0.2, z: 0.08 },
  { x: -0.16, z: 0.1 },
  { x: 0.1, z: -0.18 },
  { x: -0.12, z: -0.14 },
  { x: -0.2, z: 0.02 },
  { x: 0.14, z: -0.06 },
  { x: -0.04, z: 0.2 },
] as const;

const PLATFORM_SPACING = 0.72;

interface PlatformLayout {
  x: number;
  y: number;
  z: number;
  radius: number;
  isTop: boolean;
}

function platformY(index: number): number {
  return BASE_HEIGHT + FIRST_PLATFORM_RISE + index * PLATFORM_SPACING;
}

function computePlatformLayout(numPlatforms: number): PlatformLayout[] {
  const layouts: PlatformLayout[] = [];
  for (let i = 0; i < numPlatforms; i++) {
    const y = platformY(i);
    const isTop = i === numPlatforms - 1;
    const angle = i * 0.78 + 0.25;
    const radial = 0.18 + (i % 3) * 0.07 + Math.min(i * 0.022, 0.14);
    layouts.push({
      x: Math.cos(angle) * radial,
      y,
      z: Math.sin(angle) * radial,
      radius: isTop
        ? Math.min(0.44, 0.32 + numPlatforms * 0.015)
        : Math.max(0.22, 0.3 - i * 0.008),
      isTop,
    });
  }
  return layouts;
}

/** Rim point where a branch meets the platform underside (side facing the anchor). */
function platformBranchTarget(
  plat: PlatformLayout,
  fromX: number,
  fromZ: number,
) {
  let dx = fromX - plat.x;
  let dz = fromZ - plat.z;
  const len = Math.hypot(dx, dz);
  if (len < 0.02) {
    const fallback = Math.atan2(plat.z, plat.x) + 1.2;
    dx = Math.cos(fallback);
    dz = Math.sin(fallback);
  } else {
    dx /= len;
    dz /= len;
  }
  const rim = plat.radius * 0.82;
  // Embed slightly into the platform so the branch visibly connects
  const attachY = plat.y - PLATFORM_THICKNESS * 0.28;
  return { x: plat.x + dx * rim, y: attachY, z: plat.z + dz * rim };
}

function pickAnchorForPlatform(plat: PlatformLayout): { x: number; z: number } {
  let best: { x: number; z: number } = BASE_ANCHORS[0];
  let bestDist = 0;
  for (const anchor of BASE_ANCHORS) {
    const dist = Math.hypot(plat.x - anchor.x, plat.z - anchor.z);
    if (dist > bestDist) {
      bestDist = dist;
      best = anchor;
    }
  }
  return best;
}

function nudgeAwayFromPlatforms(
  x: number,
  z: number,
  lowerPlatforms: PlatformLayout[],
): { x: number; z: number } {
  let ox = x;
  let oz = z;
  for (const p of lowerPlatforms) {
    const dx = ox - p.x;
    const dz = oz - p.z;
    const d = Math.hypot(dx, dz);
    const minD = p.radius + 0.06;
    if (d < minD && d > 0.001) {
      const push = (minD - d) / d;
      ox += dx * push;
      oz += dz * push;
    }
  }
  return { x: ox, z: oz };
}

function treeBounds(numPlatforms: number) {
  const layouts = computePlatformLayout(numPlatforms);
  const topY = layouts[numPlatforms - 1].y + PLATFORM_THICKNESS / 2 + 0.12;
  const spread = Math.max(
    BASE_RADIUS,
    ...layouts.map((p) => Math.sqrt(p.x * p.x + p.z * p.z) + p.radius),
  );
  return { topY, spread, bottomY: 0 };
}

function createCarpetMaterial(hex: string): THREE.MeshStandardMaterial {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const base = new THREE.Color(hex);
  ctx.fillStyle = `#${base.getHexString().padStart(6, "0")}`;
  ctx.fillRect(0, 0, size, size);

  const img = ctx.getImageData(0, 0, size, size);
  const data = img.data;
  for (let i = 0; i < data.length; i += 4) {
    const n = (Math.random() - 0.5) * 32;
    data[i] = Math.max(0, Math.min(255, data[i] + n));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + n));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + n));
  }
  ctx.putImageData(img, 0, 0);

  ctx.globalAlpha = 0.06;
  ctx.strokeStyle = "#000000";
  for (let row = 0; row < size; row += 3) {
    ctx.beginPath();
    ctx.moveTo(0, row);
    ctx.lineTo(size, row);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);

  return new THREE.MeshStandardMaterial({
    map: tex,
    roughness: 0.97,
    metalness: 0,
    bumpMap: tex,
    bumpScale: 0.015,
  });
}

function positionCamera(
  camera: THREE.PerspectiveCamera,
  numPlatforms: number,
  aspect: number,
) {
  const { topY, spread } = treeBounds(numPlatforms);
  const treeHeight = topY - 0;
  const treeWidth = spread * 2;

  const fovRad = (camera.fov * Math.PI) / 180;
  const vFov = fovRad;
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);

  const distForHeight = (treeHeight * 1.18) / (2 * Math.tan(vFov / 2));
  const distForWidth = (treeWidth * 1.22) / (2 * Math.tan(hFov / 2));
  const dist = Math.max(distForHeight, distForWidth, 3.2);

  const lookAtY = treeHeight * 0.46;
  camera.position.set(0, lookAtY + treeHeight * 0.06, dist);
  camera.lookAt(0, lookAtY, 0);
}

/** Curved branch using Bezier handles (handles are not on the curve path). */
function addOrganicBranchSegment(
  group: THREE.Group,
  startX: number,
  startY: number,
  startZ: number,
  endX: number,
  endY: number,
  endZ: number,
  radius: number,
  mat: THREE.Material,
  seed: number,
  lowerPlatforms: PlatformLayout[] = [],
  castShadow = true,
) {
  const start = new THREE.Vector3(startX, startY, startZ);
  const end = new THREE.Vector3(endX, endY, endZ);
  const rise = endY - startY;
  const runX = endX - startX;
  const runZ = endZ - startZ;
  const runLen = Math.hypot(runX, runZ) || 1;
  const dirX = runX / runLen;
  const dirZ = runZ / runLen;

  const bowSign = Math.sin(seed * 1.9) >= 0 ? 1 : -1;
  const perpX = -dirZ * bowSign * 0.13;
  const perpZ = dirX * bowSign * 0.13;

  let cp1x = startX + runX * 0.32 + perpX;
  let cp1z = startZ + runZ * 0.32 + perpZ;
  const nudged1 = nudgeAwayFromPlatforms(cp1x, cp1z, lowerPlatforms);
  cp1x = nudged1.x;
  cp1z = nudged1.z;

  const cp1 = new THREE.Vector3(cp1x, startY + rise * 0.42, cp1z);

  // Final handle sits just below the attachment, approaching upward into the platform
  const cp2 = new THREE.Vector3(
    endX - dirX * 0.1,
    endY - 0.07,
    endZ - dirZ * 0.1,
  );

  const curve = new THREE.CubicBezierCurve3(start, cp1, cp2, end);
  const branch = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 20, radius, 7, false),
    mat,
  );
  branch.castShadow = castShadow;
  group.add(branch);
}

/** Short vertical stub where branch meets platform — prevents floating gap. */
function addBranchCollar(
  group: THREE.Group,
  x: number,
  y: number,
  z: number,
  platY: number,
  radius: number,
  mat: THREE.Material,
) {
  const height = Math.max(0.04, platY - PLATFORM_THICKNESS * 0.5 - y);
  const collar = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 1.08, radius * 1.15, height, 7),
    mat,
  );
  collar.position.set(x, y + height / 2, z);
  collar.castShadow = false;
  group.add(collar);
}

/** Curved branch from base anchor to a platform attachment point. */
function addOrganicBranch(
  group: THREE.Group,
  startX: number,
  startZ: number,
  endX: number,
  endY: number,
  endZ: number,
  radius: number,
  mat: THREE.Material,
  seed: number,
  lowerPlatforms: PlatformLayout[] = [],
  castShadow = true,
) {
  addOrganicBranchSegment(
    group,
    startX,
    BASE_HEIGHT,
    startZ,
    endX,
    endY,
    endZ,
    radius,
    mat,
    seed,
    lowerPlatforms,
    castShadow,
  );
}

function buildTreeBranches(
  group: THREE.Group,
  layouts: PlatformLayout[],
  barkMat: THREE.Material,
  barkLightMat: THREE.Material,
) {
  layouts.forEach((plat, i) => {
    const anchor = pickAnchorForPlatform(plat);
    const target = platformBranchTarget(plat, anchor.x, anchor.z);
    const mat = i % 2 === 0 ? barkMat : barkLightMat;
    const branchR = plat.isTop ? 0.04 : 0.034 - (i % 3) * 0.002;
    const lower = layouts.slice(0, i);

    addOrganicBranch(
      group,
      anchor.x,
      anchor.z,
      target.x,
      target.y,
      target.z,
      branchR,
      mat,
      i * 1.31 + anchor.x,
      lower,
      i > 0,
    );

    addBranchCollar(group, target.x, target.y, target.z, plat.y, branchR, mat);
  });

  // Second support on large top perches only (7–8 levels)
  if (layouts.length >= 7) {
    const top = layouts[layouts.length - 1];
    const lower = layouts.slice(0, -1);
    const usedAnchorKeys = new Set(
      layouts.map((p) => {
        const a = pickAnchorForPlatform(p);
        return `${a.x},${a.z}`;
      }),
    );

    for (const anchor of BASE_ANCHORS) {
      if (usedAnchorKeys.has(`${anchor.x},${anchor.z}`)) continue;
      const target = platformBranchTarget(top, anchor.x, anchor.z);
      addOrganicBranch(
        group,
        anchor.x,
        anchor.z,
        target.x,
        target.y,
        target.z,
        0.032,
        barkLightMat,
        anchor.x * 2.1,
        lower,
        true,
      );
      addBranchCollar(group, target.x, target.y, target.z, top.y, 0.032, barkLightMat);
      break;
    }
  }
}

// ── CatTree3DConfigurator ─────────────────────────────────────────────────────
export default function CatTree3DConfigurator() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const isDragging = useRef(false);
  const prevPointerX = useRef(0);
  const currentRotY = useRef(Math.PI / 5);
  const autoRotate = useRef(true);
  const autoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [platforms, setPlatforms] = useState(3);
  const [selectedColor, setSelectedColor] = useState(CARPET_COLORS[0]);
  const [loading, setLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const price = getPrice(platforms);
  const total = price + SHIPPING_FLAT_RATE;
  const tierName = PLATFORM_NAMES[platforms];

  const buildTree = useCallback(
    (scene: THREE.Scene, numPlatforms: number, carpetHex: string) => {
      const old = scene.getObjectByName("treeGroup");
      if (old) {
        scene.remove(old);
        old.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            const mats = Array.isArray(child.material) ? child.material : [child.material];
            mats.forEach((m: THREE.Material) => {
              if (m instanceof THREE.MeshStandardMaterial) {
                m.map?.dispose();
                m.bumpMap?.dispose();
              }
              m.dispose();
            });
          }
        });
      }

      const group = new THREE.Group();
      group.name = "treeGroup";

      const carpetMat = createCarpetMaterial(carpetHex);
      const woodMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0xa89070),
        roughness: 0.82,
        metalness: 0,
      });
      const barkMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0xc8b896),
        roughness: 0.9,
        metalness: 0,
      });
      const barkLightMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0xd8ccb4),
        roughness: 0.88,
        metalness: 0,
      });
      const shadowMat = new THREE.ShadowMaterial({ opacity: 0.28 });

      const { spread } = treeBounds(numPlatforms);

      const shadowPlane = new THREE.Mesh(
        new THREE.CircleGeometry(spread + 0.35, 32),
        shadowMat,
      );
      shadowPlane.rotation.x = -Math.PI / 2;
      shadowPlane.position.y = 0.001;
      shadowPlane.receiveShadow = true;
      group.add(shadowPlane);

      // Wood core under the carpeted base (foundation only — not a level)
      const baseCore = new THREE.Mesh(
        new THREE.CylinderGeometry(BASE_RADIUS * 0.92, BASE_RADIUS, BASE_HEIGHT * 0.55, 28),
        woodMat,
      );
      baseCore.position.y = BASE_HEIGHT * 0.28;
      baseCore.castShadow = false;
      baseCore.receiveShadow = true;
      group.add(baseCore);

      // Carpeted base pad — visually distinct from elevated perches
      const basePad = new THREE.Mesh(
        new THREE.CylinderGeometry(BASE_RADIUS, BASE_RADIUS * 0.97, BASE_HEIGHT * 0.45, 28),
        carpetMat,
      );
      basePad.position.y = BASE_HEIGHT * 0.78;
      basePad.castShadow = false;
      basePad.receiveShadow = true;
      group.add(basePad);

      const platformLayouts = computePlatformLayout(numPlatforms);

      buildTreeBranches(group, platformLayouts, barkMat, barkLightMat);

      platformLayouts.forEach((plat) => {
        const platMesh = new THREE.Mesh(
          new THREE.CylinderGeometry(plat.radius, plat.radius * 0.94, PLATFORM_THICKNESS, 28),
          carpetMat,
        );
        platMesh.position.set(plat.x, plat.y, plat.z);
        platMesh.castShadow = true;
        platMesh.receiveShadow = true;
        group.add(platMesh);
      });

      scene.add(group);
    },
    [],
  );

  const updateCamera = useCallback((numPlatforms: number) => {
    const camera = cameraRef.current;
    const container = containerRef.current;
    if (!camera || !container) return;
    const aspect = container.clientWidth / Math.max(container.clientHeight, 1);
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    positionCamera(camera, numPlatforms, aspect);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const w = container.clientWidth;
    const h = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0a08);
    scene.fog = new THREE.FogExp2(0x0c0a08, 0.022);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 60);
    positionCamera(camera, platforms, w / h);
    cameraRef.current = camera;

    scene.add(new THREE.AmbientLight(0xfff3d0, 0.6));

    const keyLight = new THREE.DirectionalLight(0xffe4a0, 1.5);
    keyLight.position.set(4, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.setScalar(2048);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 30;
    keyLight.shadow.bias = -0.0004;
    keyLight.shadow.normalBias = 0.05;
    keyLight.shadow.radius = 2;
    const shadowCam = keyLight.shadow.camera;
    shadowCam.left = -3;
    shadowCam.right = 3;
    shadowCam.top = 3;
    shadowCam.bottom = -3;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x3050a0, 0.22);
    fillLight.position.set(-4, 2, -3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xc9a45e, 0.4);
    rimLight.position.set(0, 4, -6);
    scene.add(rimLight);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    buildTree(scene, platforms, CARPET_COLORS[0].hex);

    let fId = 0;
    let prevT = 0;
    const animate = (t: number) => {
      fId = requestAnimationFrame(animate);
      const dt = Math.min((t - prevT) / 1000, 0.05);
      prevT = t;

      if (autoRotate.current && !isDragging.current) {
        currentRotY.current += dt * 0.38;
      }

      const g = scene.getObjectByName("treeGroup");
      if (g) g.rotation.y = currentRotY.current;

      renderer.render(scene, camera);
    };
    fId = requestAnimationFrame(animate);

    const ro = new ResizeObserver(() => {
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
      positionCamera(camera, platforms, nw / nh);
    });
    ro.observe(container);

    return () => {
      cancelAnimationFrame(fId);
      ro.disconnect();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;
    buildTree(sceneRef.current, platforms, selectedColor.hex);
    updateCamera(platforms);
  }, [platforms, selectedColor, buildTree, updateCamera]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    autoRotate.current = false;
    if (autoTimer.current) clearTimeout(autoTimer.current);
    prevPointerX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - prevPointerX.current;
    currentRotY.current += dx * 0.013;
    prevPointerX.current = e.clientX;
  }, []);

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
    if (autoTimer.current) clearTimeout(autoTimer.current);
    autoTimer.current = setTimeout(() => {
      autoRotate.current = true;
    }, 3000);
  }, []);

  const handleCheckout = async () => {
    setLoading(true);
    setCheckoutError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platforms, color: selectedColor.name, price }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Unable to start checkout. Please try again.");
      }
      window.location.href = data.url;
    } catch (err: unknown) {
      setLoading(false);
      setCheckoutError(err instanceof Error ? err.message : "An unexpected error occurred.");
    }
  };

  const decrement = () => setPlatforms((p) => Math.max(MIN_PLATFORMS, p - 1));
  const increment = () => setPlatforms((p) => Math.min(MAX_PLATFORMS, p + 1));

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">

      {/* ── Left: 3D canvas ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <div
          ref={containerRef}
          className="relative w-full aspect-4/5 overflow-hidden cursor-grab active:cursor-grabbing select-none"
          style={{ touchAction: "none" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        />
        <p className="text-center font-jost text-xs text-stone-300 tracking-widest uppercase">
          Drag to rotate
        </p>
        <p className="text-center font-jost text-xs text-stone-500 tracking-widest uppercase">
          All trees are made to order with natural variations — your tree may look different from the preview, but will be just as awesome!
        </p>
      </div>

      <div className="flex flex-col gap-8">
        <div>
          <p className="eyebrow mb-2">Handcrafted Natural Wood</p>
          <h1 className="font-playfair text-4xl font-bold leading-tight text-cream">
            Natural Wood{" "}
            <span className="italic text-gold">Cat Tree</span>
          </h1>
        </div>

        <div className="border-b border-stone-800 pb-6">
          <div className="flex items-baseline gap-3">
            <span className="font-playfair text-4xl font-bold text-cream">
              {formatCurrency(price)}
            </span>
            <span className="font-cormorant text-lg text-stone-400">
              + {formatCurrency(SHIPPING_FLAT_RATE)} shipping
            </span>
          </div>
          <p className="mt-1 font-cormorant text-sm text-stone-500">
            Ships from Cheyenne, WY · ~30 day lead time
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="eyebrow">Number of Platforms</p>
              <p className="mt-1 font-playfair text-lg font-semibold text-gold">{tierName}</p>
            </div>
            <p className="font-playfair text-lg text-stone-400">
              {formatCurrency(MIN_PLATFORMS * PRICE_PER_PLATFORM)} –{" "}
              {formatCurrency(MAX_PLATFORMS * PRICE_PER_PLATFORM)}
            </p>
          </div>

          <div className="flex items-center gap-5 mb-4">
            <button
              onClick={decrement}
              disabled={platforms <= MIN_PLATFORMS}
              aria-label="Decrease platforms"
              className="flex items-center justify-center w-10 h-10 border border-stone-700 text-cream hover:border-gold hover:text-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer font-jost text-lg"
            >
              −
            </button>
            <span className="font-playfair text-3xl font-bold text-cream w-8 text-center">
              {platforms}
            </span>
            <button
              onClick={increment}
              disabled={platforms >= MAX_PLATFORMS}
              aria-label="Increase platforms"
              className="flex items-center justify-center w-10 h-10 border border-stone-700 text-cream hover:border-gold hover:text-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer font-jost text-lg"
            >
              +
            </button>
          </div>

          <div className="flex gap-1.5" role="presentation">
            {Array.from({ length: MAX_PLATFORMS - MIN_PLATFORMS + 1 }, (_, i) => {
              const level = i + MIN_PLATFORMS;
              return (
                <button
                  key={level}
                  onClick={() => setPlatforms(level)}
                  aria-label={`${level} platforms`}
                  className={`flex-1 h-1.5 progress-segment cursor-pointer transition-colors ${
                    level <= platforms ? "bg-gold" : "bg-stone-800"
                  }`}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="font-jost text-xs text-stone-500">{MIN_PLATFORMS} platforms</span>
            <span className="font-jost text-xs text-stone-500">{MAX_PLATFORMS} platforms</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="eyebrow">Carpet Color</p>
            <span className="font-cormorant text-sm text-gold font-semibold">
              {selectedColor.name}
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {CARPET_COLORS.map((color) => {
              const isSelected = selectedColor.name === color.name;
              return (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  aria-label={`Select ${color.name} carpet`}
                  title={color.name}
                  className={`aspect-square w-full rounded-sm cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? "ring-2 ring-gold ring-offset-2 ring-offset-background scale-110"
                      : "hover:scale-105"
                  } ${
                    color.name === "White" || color.name === "Beige"
                      ? "border border-stone-700"
                      : ""
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              );
            })}
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 p-5 space-y-3">
          <p className="eyebrow mb-3">Order Summary</p>

          {[
            ["Tier", tierName],
            ["Platforms", `${platforms} platforms`],
            ["Carpet Color", selectedColor.name],
            ["Base Diameter", '24"'],
            ["Sisal Wrapping", "Included"],
            ["Build Time", "~30 days"],
            ["Ships From", "Cheyenne, WY"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between">
              <span className="font-jost text-sm text-stone-500 uppercase tracking-wider">
                {label}
              </span>
              <span className="font-jost text-sm text-stone-300">{value}</span>
            </div>
          ))}

          <div className="border-t border-stone-800 pt-3 mt-3 flex items-center justify-between">
            <span className="font-jost text-xs text-stone-400 uppercase tracking-wider">
              Subtotal
            </span>
            <span className="font-jost text-sm text-stone-300">{formatCurrency(price)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-jost text-xs text-stone-400 uppercase tracking-wider">
              Shipping
            </span>
            <span className="font-jost text-sm text-stone-300">
              {formatCurrency(SHIPPING_FLAT_RATE)}
            </span>
          </div>
          <div className="border-t border-stone-800 pt-3 flex items-center justify-between">
            <span className="font-jost text-xs text-cream uppercase tracking-wider font-semibold">
              Order Total
            </span>
            <span className="font-jost text-base font-bold text-gold">
              {formatCurrency(total)}
            </span>
          </div>
        </div>

        {checkoutError && (
          <p className="font-cormorant text-sm text-red-400 border border-red-900/60 bg-red-950/30 px-4 py-3">
            {checkoutError}
          </p>
        )}

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-2xl font-jost text-base font-semibold tracking-widest uppercase px-8 py-5 bg-gold text-stone-950 hover:bg-gold-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading && <span className="spinner" aria-hidden="true" />}
          {loading ? "Redirecting to Checkout…" : `Order Now — ${formatCurrency(total)}`}
        </button>

        <p className="text-center font-jost text-xs text-stone-500 tracking-wide">
          Secure checkout via Stripe · Full payment due at time of order
        </p>

        <div className="border border-stone-800 p-5">
          <p className="eyebrow mb-2">Want Something Unique?</p>
          <p className="font-cormorant text-base text-stone-400 leading-relaxed mb-4">
            We build custom-themed trees — mushrooms, hieroglyphs, botanicals, and beyond.
            Tell us your vision and we&apos;ll bring it to life.
          </p>
          <a
            href="/commission"
            className="inline-flex font-jost text-xs font-semibold tracking-widest uppercase text-gold hover:text-gold-light transition-colors"
          >
            Request a Custom Commission →
          </a>
        </div>
      </div>
    </div>
  );
}
