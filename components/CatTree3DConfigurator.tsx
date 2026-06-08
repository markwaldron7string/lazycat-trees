"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import * as THREE from "three";
import {
  CARPET_COLORS,
  PLATFORM_NAMES,
  PLATFORM_DESIGNS,
  MIN_PLATFORMS,
  MAX_PLATFORMS,
  PRICE_PER_PLATFORM,
  SHIPPING_FLAT_RATE,
  getPlatformDesign,
  getPrice,
  formatCurrency,
  type PlatformDesign,
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

interface PlatformSelection {
  design: PlatformDesign;
  colorHex: string;
}

const SOLID_PREVIEW_SWATCHES = [
  "#1a1a1a",
  "#3b5fc0",
  "#b82020",
  "#1e7a3a",
  "#7b3fa0",
  "#d4c4a0",
  "#c9a45e",
  "#a8a8b0",
] as const;

const DESIGN_PREVIEW_IMAGES: Partial<
  Record<PlatformDesign["pattern"], { src: string; position?: string; background?: string }>
> = {
  "stars-stripes": {
    src: "/images/usaflag.png",
    position: "50% 46%",
  },
  hieroglyphs: {
    src: "/images/eyeofhorus.png",
  },
  mushrooms: {
    src: "/images/mushrooms.png",
    position: "50% 55%",
  },
  zebra: {
    src: "/images/zebrastripes.png",
    background: "#ffffff",
  },
  celestial: {
    src: "/images/celestialnight.png",
  },
};

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

function drawStar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  outerRadius: number,
  innerRadius: number,
  fill: string,
) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    ctx.lineTo(x + Math.cos(angle) * r, y + Math.sin(angle) * r);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

function drawCrescent(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  fill: string,
  cutout: string,
) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = cutout;
  ctx.beginPath();
  ctx.arc(x + radius * 0.42, y - radius * 0.14, radius * 0.92, 0, Math.PI * 2);
  ctx.fill();
}

function drawDesignPattern(
  ctx: CanvasRenderingContext2D,
  design: PlatformDesign,
  size: number,
  levelIndex: number,
) {
  const accent = design.accentHex;
  const secondary = design.secondaryHex;

  if (design.pattern === "solid") return;

  if (design.pattern === "stars-stripes") {
    const variant = levelIndex % 3;
    const starColor = "#ffffff";
    const drawStarGrid = (
      startX: number,
      endX: number,
      startY: number,
      endY: number,
      cols: number,
      rows: number,
      radius = 3.7,
    ) => {
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = startX + ((col + 0.55) / cols) * (endX - startX);
          const y = startY + ((row + 0.5) / rows) * (endY - startY);
          drawStar(ctx, x, y, radius, radius * 0.45, starColor);
        }
      }
    };

    if (variant === 1) {
      ctx.fillStyle = design.baseHex;
      ctx.fillRect(0, 0, size, size);
      drawStarGrid(8, size - 8, 10, size * 0.58, 7, 4, 3.4);

      const stripeH = (size * 0.38) / 5;
      for (let row = 0; row < 5; row++) {
        ctx.fillStyle = row % 2 === 0 ? accent : secondary;
        ctx.fillRect(0, size * 0.62 + row * stripeH, size, stripeH);
      }
      return;
    }

    if (variant === 2) {
      const cantonW = size * 0.42;
      ctx.fillStyle = design.baseHex;
      ctx.fillRect(0, 0, cantonW, size);
      const stripeH = size / 9;
      for (let row = 0; row < 9; row++) {
        ctx.fillStyle = row % 2 === 0 ? accent : secondary;
        ctx.fillRect(cantonW, row * stripeH, size - cantonW, stripeH);
      }
      drawStarGrid(7, cantonW - 5, 8, size - 8, 3, 5, 3.2);
      return;
    }

    const stripeH = size / 7;
    for (let row = 0; row < 7; row++) {
      ctx.fillStyle = row % 2 === 0 ? accent : secondary;
      ctx.fillRect(0, row * stripeH, size, stripeH);
    }
    const cantonW = size * 0.5;
    const cantonH = stripeH * 4.2;
    ctx.fillStyle = design.baseHex;
    ctx.fillRect(0, 0, cantonW, cantonH);
    drawStarGrid(7, cantonW - 5, 8, cantonH - 5, 4, 3);
    return;
  }

  if (design.pattern === "hieroglyphs") {
    ctx.fillStyle = secondary;
    ctx.fillRect(0, 0, size, size);

    ctx.globalAlpha = 0.28;
    ctx.fillStyle = design.baseHex;
    for (let i = 0; i < 16; i++) {
      const x = (i * 37 + levelIndex * 9) % size;
      const y = (i * 23 + levelIndex * 13) % size;
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    ctx.strokeStyle = accent;
    ctx.fillStyle = accent;
    ctx.lineWidth = 2.4;
    const glyphs = ["𓂀", "𓆣", "𓃭", "𓇳"];
    ctx.font = "30px serif";
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        const x = 12 + col * 40 + ((row + levelIndex) % 2) * 8;
        const y = 28 + row * 30;
        ctx.fillText(glyphs[(row + col + levelIndex) % glyphs.length], x, y);
      }
    }
    return;
  }

  if (design.pattern === "mushrooms") {
    ctx.fillStyle = design.baseHex;
    ctx.fillRect(0, 0, size, size);

    ctx.globalAlpha = 0.18;
    ctx.fillStyle = secondary;
    ctx.fillRect(0, size * 0.78, size, size * 0.22);
    ctx.globalAlpha = 1;

    const spots = [
      [24, 28, 13],
      [66, 20, 8],
      [102, 35, 17],
      [44, 70, 19],
      [92, 82, 10],
      [16, 108, 8],
      [70, 116, 15],
      [120, 112, 11],
    ];
    ctx.fillStyle = accent;
    for (const [x, y, r] of spots) {
      ctx.beginPath();
      ctx.arc(
        x + ((levelIndex % 2) * 5),
        y + ((levelIndex % 3) * 3),
        r,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }

    ctx.strokeStyle = "rgba(0,0,0,0.16)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, size * 0.78);
    ctx.quadraticCurveTo(size * 0.5, size * 0.88, size, size * 0.78);
    ctx.stroke();
    return;
  }

  if (design.pattern === "zebra") {
    ctx.fillStyle = design.baseHex;
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = accent;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (let stripe = -36; stripe < size + 52; stripe += 22) {
      const wobble = ((stripe / 22 + levelIndex) % 3) * 8;
      ctx.lineWidth = stripe % 44 === 0 ? 12 : 8;
      ctx.beginPath();
      ctx.moveTo(stripe, -10);
      ctx.bezierCurveTo(
        stripe + 34,
        22 + wobble,
        stripe - 18,
        68 - wobble,
        stripe + 28,
        size + 12,
      );
      ctx.stroke();
    }

    ctx.globalAlpha = 0.35;
    ctx.strokeStyle = secondary;
    ctx.lineWidth = 3;
    for (let stripe = -20; stripe < size + 30; stripe += 34) {
      ctx.beginPath();
      ctx.moveTo(stripe + 16, -8);
      ctx.quadraticCurveTo(stripe - 8, 48, stripe + 18, size + 8);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    return;
  }

  if (design.pattern === "celestial") {
    ctx.fillStyle = design.baseHex;
    ctx.fillRect(0, 0, size, size);

    drawCrescent(ctx, 96, 28, 12, secondary, design.baseHex);
    drawCrescent(ctx, 28, 98, 8, accent, design.baseHex);

    for (let i = 0; i < 24; i++) {
      const x = (i * 29 + levelIndex * 17) % size;
      const y = (i * 47 + levelIndex * 9) % size;
      drawStar(
        ctx,
        x,
        y,
        i % 5 === 0 ? 5 : 3,
        i % 5 === 0 ? 2 : 1.2,
        i % 3 === 0 ? accent : secondary,
      );
    }

    ctx.strokeStyle = "rgba(240,236,228,0.72)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(16, 92);
    ctx.lineTo(48, 54);
    ctx.lineTo(78, 70);
    ctx.lineTo(110, 22);
    ctx.stroke();

    ctx.strokeStyle = "rgba(201,164,94,0.72)";
    ctx.beginPath();
    ctx.moveTo(14, 28);
    ctx.lineTo(38, 18);
    ctx.lineTo(58, 36);
    ctx.lineTo(78, 20);
    ctx.stroke();
  }
}

function createCarpetMaterial(
  design: PlatformDesign,
  solidHex: string,
  levelIndex = 0,
): THREE.MeshStandardMaterial {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const baseHex = design.pattern === "solid" ? solidHex : design.baseHex;
  const base = new THREE.Color(baseHex);
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
  ctx.globalAlpha = 1;

  drawDesignPattern(ctx, design, size, levelIndex);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  const repeat =
    design.pattern === "solid"
      ? 4
      : design.pattern === "mushrooms"
        ? 1.35
        : design.pattern === "stars-stripes"
          ? 1.55
          : design.pattern === "celestial"
            ? 1.7
            : 2;
  tex.repeat.set(repeat, repeat);

  return new THREE.MeshStandardMaterial({
    map: tex,
    roughness: 0.97,
    metalness: 0,
    bumpMap: tex,
    bumpScale: 0.015,
  });
}

function PreviewStar({
  x,
  y,
  size = 1,
  fill = "#ffffff",
}: {
  x: number;
  y: number;
  size?: number;
  fill?: string;
}) {
  return (
    <polygon
      points="0,-5 1.35,-1.7 4.9,-1.55 2.05,0.75 3.05,4.35 0,2.25 -3.05,4.35 -2.05,0.75 -4.9,-1.55 -1.35,-1.7"
      transform={`translate(${x} ${y}) scale(${size})`}
      fill={fill}
    />
  );
}

function DesignPreview({ design }: { design: PlatformDesign }) {
  const swatchClass = "block h-9 w-full overflow-hidden border border-white/10 bg-stone-900";
  const previewImage = DESIGN_PREVIEW_IMAGES[design.pattern];

  if (design.pattern === "solid") {
    return (
      <svg className={swatchClass} viewBox="0 0 560 70" preserveAspectRatio="none" aria-hidden="true">
        {SOLID_PREVIEW_SWATCHES.map((color, i) => (
          <rect key={color} x={i * 70} y="0" width="70" height="70" fill={color} />
        ))}
        <rect x="0" y="0" width="560" height="70" fill="none" stroke="rgba(255,255,255,0.12)" />
      </svg>
    );
  }

  if (previewImage) {
    return (
      <span
        className={`${swatchClass} relative`}
        style={{ backgroundColor: previewImage.background }}
        aria-hidden="true"
      >
        <Image
          src={previewImage.src}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 640px) 45vw, 180px"
          style={{ objectPosition: previewImage.position ?? "center" }}
        />
      </span>
    );
  }

  if (design.pattern === "stars-stripes") {
    const stripeHeight = 10;
    return (
      <svg className={swatchClass} viewBox="0 0 560 70" preserveAspectRatio="none" aria-hidden="true">
        {Array.from({ length: 7 }, (_, row) => (
          <rect
            key={row}
            x="0"
            y={row * stripeHeight}
            width="560"
            height={stripeHeight}
            fill={row % 2 === 0 ? design.accentHex : design.secondaryHex}
          />
        ))}
        <rect x="0" y="0" width="224" height="40" fill={design.baseHex} />
        {[18, 54, 90, 126, 162, 198].map((x, i) => (
          <PreviewStar key={x} x={x} y={i % 2 === 0 ? 14 : 28} size={1.15} />
        ))}
        {[36, 72, 108, 144, 180].map((x) => (
          <PreviewStar key={x} x={x} y={21} size={0.95} />
        ))}
      </svg>
    );
  }

  if (design.pattern === "hieroglyphs") {
    return (
      <svg className={swatchClass} viewBox="0 0 560 70" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="glyph-gold" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={design.secondaryHex} />
            <stop offset="100%" stopColor={design.baseHex} />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="560" height="70" fill="url(#glyph-gold)" />
        <path
          d="M145 35 C190 8 278 8 332 35 C278 62 190 62 145 35Z"
          fill="none"
          stroke={design.accentHex}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="240" cy="35" r="14" fill="none" stroke={design.accentHex} strokeWidth="5" />
        <circle cx="240" cy="35" r="6" fill={design.accentHex} />
        <path
          d="M305 44 C322 55 318 65 302 68"
          fill="none"
          stroke={design.accentHex}
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M190 45 C174 57 152 58 134 50"
          fill="none"
          stroke={design.accentHex}
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (design.pattern === "mushrooms") {
    return (
      <svg className={swatchClass} viewBox="0 0 560 70" preserveAspectRatio="none" aria-hidden="true">
        <rect x="0" y="0" width="560" height="70" fill={design.baseHex} />
        <circle cx="120" cy="30" r="20" fill={design.accentHex} />
        <circle cx="250" cy="38" r="13" fill={design.accentHex} />
        <circle cx="390" cy="25" r="24" fill={design.accentHex} />
        <circle cx="505" cy="42" r="15" fill={design.accentHex} />
      </svg>
    );
  }

  if (design.pattern === "zebra") {
    return (
      <svg className={swatchClass} viewBox="0 0 560 70" preserveAspectRatio="none" aria-hidden="true">
        <rect x="0" y="0" width="560" height="70" fill={design.baseHex} />
        <path d="M42 -8 C70 14 58 44 86 78 L120 78 C92 42 108 12 76 -8Z" fill={design.accentHex} />
        <path d="M176 -8 C206 18 182 42 216 78 L256 78 C226 42 250 18 218 -8Z" fill={design.accentHex} />
        <path d="M320 -8 C356 16 334 48 368 78 L410 78 C378 40 398 14 360 -8Z" fill={design.accentHex} />
        <path d="M472 -8 C508 18 490 46 528 78 L568 78 C536 40 554 14 516 -8Z" fill={design.accentHex} />
      </svg>
    );
  }

  return (
    <svg className={swatchClass} viewBox="0 0 560 70" preserveAspectRatio="none" aria-hidden="true">
      <rect x="0" y="0" width="560" height="70" fill={design.baseHex} />
      <circle cx="390" cy="28" r="18" fill={design.secondaryHex} />
      <circle cx="407" cy="24" r="17" fill={design.baseHex} />
      <PreviewStar x={100} y={25} size={1.15} fill={design.accentHex} />
      <PreviewStar x={170} y={45} size={0.78} fill={design.secondaryHex} />
      <PreviewStar x={275} y={24} size={0.9} fill={design.secondaryHex} />
      <PreviewStar x={485} y={44} size={1.05} fill={design.accentHex} />
      <path
        d="M80 50 L145 28 L220 45 L300 20"
        fill="none"
        stroke="rgba(240,236,228,0.72)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
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

/** Short vertical stub where branch meets platform - prevents floating gap. */
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

  // Second support on large top perches only (7-8 levels)
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
  const [selectedDesignId, setSelectedDesignId] = useState(PLATFORM_DESIGNS[0].id);
  const [mixPlatforms, setMixPlatforms] = useState(false);
  const [platformDesignIds, setPlatformDesignIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const price = getPrice(platforms);
  const total = price + SHIPPING_FLAT_RATE;
  const tierName = PLATFORM_NAMES[platforms];
  const selectedDesign = getPlatformDesign(selectedDesignId);
  const platformSelections = useMemo<PlatformSelection[]>(() => {
    return Array.from({ length: platforms }, (_, i) => {
      const designId = mixPlatforms
        ? platformDesignIds[i] ?? selectedDesignId
        : selectedDesignId;
      return {
        design: getPlatformDesign(designId),
        colorHex: selectedColor.hex,
      };
    });
  }, [platforms, mixPlatforms, platformDesignIds, selectedDesignId, selectedColor.hex]);
  const usesSolidCarpet = platformSelections.some(
    ({ design }) => design.pattern === "solid",
  );
  const designSummary = mixPlatforms
    ? platformSelections
        .map(({ design }, i) => `P${i + 1}: ${design.shortName}`)
        .join(", ")
    : selectedDesign.pattern === "solid"
      ? `${selectedColor.name} Solid Carpet`
      : selectedDesign.name;
  const requiresCustomQuote = mixPlatforms || selectedDesign.pattern !== "solid";
  const customOrderHref =
    `/commission?platforms=${platforms}` +
    `&design=${encodeURIComponent(designSummary)}` +
    `&palette=${encodeURIComponent(
      selectedDesign.pattern === "solid" ? selectedColor.name : selectedDesign.name,
    )}`;

  const buildTree = useCallback(
    (
      scene: THREE.Scene,
      numPlatforms: number,
      selections: PlatformSelection[],
    ) => {
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

      const fallbackSelection = selections[0] ?? {
        design: PLATFORM_DESIGNS[0],
        colorHex: CARPET_COLORS[0].hex,
      };
      const baseCarpetMat = createCarpetMaterial(
        fallbackSelection.design,
        fallbackSelection.colorHex,
      );
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

      // Wood core under the carpeted base (foundation only - not a level)
      const baseCore = new THREE.Mesh(
        new THREE.CylinderGeometry(BASE_RADIUS * 0.92, BASE_RADIUS, BASE_HEIGHT * 0.55, 28),
        woodMat,
      );
      baseCore.position.y = BASE_HEIGHT * 0.28;
      baseCore.castShadow = false;
      baseCore.receiveShadow = true;
      group.add(baseCore);

      // Carpeted base pad - visually distinct from elevated perches
      const basePad = new THREE.Mesh(
        new THREE.CylinderGeometry(BASE_RADIUS, BASE_RADIUS * 0.97, BASE_HEIGHT * 0.45, 28),
        baseCarpetMat,
      );
      basePad.position.y = BASE_HEIGHT * 0.78;
      basePad.castShadow = false;
      basePad.receiveShadow = true;
      group.add(basePad);

      const platformLayouts = computePlatformLayout(numPlatforms);

      buildTreeBranches(group, platformLayouts, barkMat, barkLightMat);

      platformLayouts.forEach((plat, i) => {
        const selection = selections[i] ?? fallbackSelection;
        const carpetMat = createCarpetMaterial(selection.design, selection.colorHex, i + 1);
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
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    buildTree(scene, platforms, [
      { design: PLATFORM_DESIGNS[0], colorHex: CARPET_COLORS[0].hex },
    ]);

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
    buildTree(sceneRef.current, platforms, platformSelections);
    updateCamera(platforms);
  }, [platforms, platformSelections, buildTree, updateCamera]);

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
        body: JSON.stringify({
          platforms,
          color: selectedColor.name,
          design: designSummary,
          price,
        }),
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
  const setPlatformDesign = (index: number, designId: string) => {
    setPlatformDesignIds((prev) => {
      const next = [...prev];
      next[index] = designId;
      return next;
    });
  };

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
          All trees are made to order with natural variations - your tree may look different from the preview, but will be just as awesome!
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
              {formatCurrency(MIN_PLATFORMS * PRICE_PER_PLATFORM)} -{" "}
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
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <p className="eyebrow">Platform Design</p>
              <p className="mt-1 font-cormorant text-sm text-stone-500">
                Choose one look or mix designs by platform.
              </p>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <span className="font-jost text-xs uppercase tracking-widest text-stone-400">
                Mix
              </span>
              <input
                type="checkbox"
                checked={mixPlatforms}
                onChange={(e) => setMixPlatforms(e.target.checked)}
                className="sr-only"
              />
              <span
                className={`relative inline-flex h-6 w-11 items-center rounded-full border transition-colors ${
                  mixPlatforms
                    ? "border-gold bg-gold/30"
                    : "border-stone-700 bg-stone-950"
                }`}
                aria-hidden="true"
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-cream transition-transform ${
                    mixPlatforms ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PLATFORM_DESIGNS.map((design) => {
              const isSelected = selectedDesignId === design.id && !mixPlatforms;
              return (
                <button
                  key={design.id}
                  type="button"
                  onClick={() => setSelectedDesignId(design.id)}
                  className={`flex min-h-24 flex-col justify-between border p-3 text-left transition-colors cursor-pointer ${
                    isSelected
                      ? "border-gold bg-[#111d36]"
                      : "border-stone-800 bg-stone-950 hover:border-stone-600"
                  }`}
                  aria-pressed={isSelected}
                >
                  <DesignPreview design={design} />
                  <span className="mt-3 font-jost text-xs font-semibold uppercase tracking-widest text-cream">
                    {design.name}
                  </span>
                  <span className="mt-1 font-cormorant text-xs leading-snug text-stone-500">
                    {design.description}
                  </span>
                </button>
              );
            })}
          </div>

          {mixPlatforms && (
            <div className="mt-4 border border-stone-800 bg-stone-950 p-4">
              <p className="eyebrow mb-3">Platform Mix</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {platformSelections.map(({ design }, i) => (
                  <label key={i} className="block">
                    <span className="mb-1 block font-jost text-xs uppercase tracking-widest text-stone-500">
                      Platform {i + 1}
                    </span>
                    <select
                      value={design.id}
                      onChange={(e) => setPlatformDesign(i, e.target.value)}
                      className="w-full border border-stone-700 bg-[#0a1628] px-3 py-2 pr-9 font-cormorant text-sm text-cream outline-none focus:border-gold"
                    >
                      {PLATFORM_DESIGNS.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
              <p className="mt-3 font-cormorant text-sm leading-relaxed text-stone-500">
                The base pad follows Platform 1. The final layout, artwork, and any custom-art pricing are confirmed before the build starts.
              </p>
            </div>
          )}
        </div>

        {usesSolidCarpet && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="eyebrow">Solid Carpet Color</p>
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
        )}

        <div className="bg-[#0f1f3d] border border-[#1e2e50] p-5 space-y-3">
          <p className="eyebrow mb-3" style={{ color: '#b22234' }}>Order Summary</p>

          {[
            ["Tier", tierName],
            ["Platforms", `${platforms} platforms`],
            ["Design", designSummary],
            ...(usesSolidCarpet ? [["Solid Color", selectedColor.name]] : []),
            ["Base Diameter", '24"'],
            ["Sisal Wrapping", "Included"],
            ["Build Time", "~30 days"],
            ["Ships From", "Cheyenne, WY"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-start justify-between gap-4">
              <span className="font-jost text-sm text-[#c9a45e] uppercase tracking-wider">
                {label}
              </span>
              <span className="text-right font-jost text-sm font-semibold text-white">{value}</span>
            </div>
          ))}

          <div className="border-t border-[#1e2e50] pt-3 mt-3 flex items-center justify-between">
            <span className="font-jost text-xs text-stone-400 uppercase tracking-wider">
              Subtotal
            </span>
            <span className="font-jost text-sm font-semibold text-white">{formatCurrency(price)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-jost text-xs text-stone-400 uppercase tracking-wider">
              Shipping
            </span>
            <span className="font-jost text-sm font-semibold text-white">
              {formatCurrency(SHIPPING_FLAT_RATE)}
            </span>
          </div>
          <div className="border-t border-[#1e2e50] pt-3 flex items-center justify-between">
            <span className="font-jost text-xs text-white uppercase tracking-wider font-bold">
              Order Total
            </span>
            <span className="font-jost text-base font-bold text-[#c9a45e]">
              {formatCurrency(total)}
            </span>
          </div>
        </div>

        {checkoutError && (
          <p className="font-cormorant text-sm text-red-400 border border-red-900/60 bg-red-950/30 px-4 py-3">
            {checkoutError}
          </p>
        )}

        {requiresCustomQuote ? (
          <Link
            href={customOrderHref}
            className="flex w-full items-center justify-center gap-3 rounded-2xl font-jost text-base font-semibold tracking-widest uppercase px-8 py-5 bg-gold text-stone-950 hover:bg-gold-light transition-colors"
          >
            Request Custom Order - {formatCurrency(total)} Base
          </Link>
        ) : (
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-2xl font-jost text-base font-semibold tracking-widest uppercase px-8 py-5 bg-gold text-stone-950 hover:bg-gold-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading && <span className="spinner" aria-hidden="true" />}
            {loading ? "Redirecting to Checkout…" : `Order Now - ${formatCurrency(total)}`}
          </button>
        )}

        <p className="text-center font-jost text-xs text-stone-500 tracking-wide">
          {requiresCustomQuote
            ? "Themed and mixed-platform builds start from standard pricing; final custom-art pricing is confirmed before payment."
            : "Secure checkout via Stripe · Full payment due at time of order"}
        </p>

        <div className="border border-stone-800 p-5">
          <p className="eyebrow mb-2">Want Something Unique?</p>
          <p className="font-cormorant text-base text-stone-400 leading-relaxed mb-4">
            We build custom-themed trees - mushroom caps, hieroglyphs, zebra stripes, and beyond.
            Tell us your vision and we&apos;ll bring it to life.
          </p>
          <Link
            href="/commission"
            className="inline-flex font-jost text-xs font-semibold tracking-widest uppercase text-gold hover:text-gold-light transition-colors"
          >
            Request a Custom Order →
          </Link>
        </div>
      </div>
    </div>
  );
}
