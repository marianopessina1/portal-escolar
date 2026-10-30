import * as THREE from "three";
import type { Flavor } from "@/lib/data";

function cssFont(variable: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return v ? `${v}, ${fallback}` : fallback;
}

/** Wrap-around paper label, drawn on a canvas so it can change per flavour. */
export function createLabelTexture(flavor: Flavor, index: number) {
  const W = 2048;
  const H = 560;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const display = cssFont("--font-display", "Impact, sans-serif");
  const serif = cssFont("--font-serif", "Georgia, serif");
  const sans = cssFont("--font-sans", "Helvetica, sans-serif");

  // paper
  ctx.fillStyle = "#0d0a08";
  ctx.fillRect(0, 0, W, H);

  // paper fibres / grain
  const img = ctx.getImageData(0, 0, W, H);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 18;
    img.data[i] += n;
    img.data[i + 1] += n;
    img.data[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);

  // top & bottom accent bands
  ctx.fillStyle = flavor.accent;
  ctx.fillRect(0, 0, W, 34);
  ctx.fillRect(0, H - 34, W, 34);
  ctx.fillStyle = "#0d0a08";
  for (let x = 0; x < W; x += 28) ctx.fillRect(x, 12, 14, 10);

  const cx = W / 2;

  // brand
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#f5ebdc";
  ctx.font = `200px ${display}`;
  ctx.fillText("FUEGO NEGRO", cx, 205);

  // flavour name
  ctx.fillStyle = flavor.accent;
  ctx.font = `italic 86px ${serif}`;
  ctx.fillText(flavor.name, cx, 352);

  // heat meter
  const dots = 5;
  const gap = 46;
  const startX = cx - ((dots - 1) * gap) / 2;
  for (let i = 0; i < dots; i++) {
    ctx.beginPath();
    ctx.arc(startX + i * gap, 440, 13, 0, Math.PI * 2);
    ctx.fillStyle = i < flavor.heat ? flavor.accent : "rgba(245,235,220,0.18)";
    ctx.fill();
  }

  // side copy
  ctx.font = `600 26px ${sans}`;
  ctx.fillStyle = "rgba(245,235,220,0.65)";
  ctx.textAlign = "left";
  ctx.fillText(`Nº 0${index + 1} — SALSA DE AUTOR`, 110, 120);
  ctx.fillText(flavor.scoville, 110, 160);
  ctx.textAlign = "right";
  ctx.fillText("HECHA A FUEGO LENTO", W - 110, 120);
  ctx.fillText("250 ML · 8.45 FL OZ", W - 110, 160);

  // fine frame
  ctx.strokeStyle = "rgba(245,235,220,0.25)";
  ctx.lineWidth = 3;
  ctx.strokeRect(70, 70, W - 140, H - 140);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** Sauce body: suspended chili seeds & flakes so the liquid doesn't read as plastic. */
export function createSauceTexture() {
  const S = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, S, S);

  // soft tonal variation
  for (let i = 0; i < 60; i++) {
    const g = ctx.createRadialGradient(Math.random() * S, Math.random() * S, 0, Math.random() * S, Math.random() * S, 160);
    g.addColorStop(0, `rgba(120,60,20,${Math.random() * 0.12})`);
    g.addColorStop(1, "rgba(120,60,20,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, S, S);
  }
  // seeds (pale) and flakes (dark)
  for (let i = 0; i < 900; i++) {
    const x = Math.random() * S;
    const y = Math.random() * S;
    const dark = Math.random() > 0.45;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.random() * Math.PI);
    ctx.fillStyle = dark ? `rgba(40,8,2,${0.35 + Math.random() * 0.4})` : `rgba(255,230,170,${0.35 + Math.random() * 0.4})`;
    ctx.beginPath();
    ctx.ellipse(0, 0, 2 + Math.random() * 6, 1 + Math.random() * 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/** Soft, lumpy smoke puff for the steam sprites. */
export function createSmokeTexture() {
  const S = 256;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d")!;
  for (let i = 0; i < 26; i++) {
    const r = 30 + Math.random() * 60;
    const a = Math.random() * Math.PI * 2;
    const d = Math.random() * 50;
    const x = S / 2 + Math.cos(a) * d;
    const y = S / 2 + Math.sin(a) * d;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, "rgba(255,255,255,0.22)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, S, S);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Radial glow used as a halo behind the jar. */
export function createGlowTexture() {
  const S = 512;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.35)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
