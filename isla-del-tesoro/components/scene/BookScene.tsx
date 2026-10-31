"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Environment, Lightformer, Sparkles, Float } from "@react-three/drei";
import * as THREE from "three";
import { bookState } from "@/lib/bookState";

const W = 2.2;
const H = 3.0;
const D = 0.44;

function pagesTexture(rotate: boolean) {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const g = c.getContext("2d")!;
  g.fillStyle = "#e9dcc0";
  g.fillRect(0, 0, 256, 256);
  for (let x = 0; x < 256; x += 2) {
    g.fillStyle = `rgba(120, 90, 50, ${0.08 + Math.random() * 0.12})`;
    g.fillRect(x, 0, 1, 256);
  }
  // gilt edges, as on the collector's edition
  const grad = g.createLinearGradient(0, 0, 256, 0);
  grad.addColorStop(0, "rgba(217,176,100,0.55)");
  grad.addColorStop(0.5, "rgba(243,221,159,0.25)");
  grad.addColorStop(1, "rgba(217,176,100,0.55)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  if (rotate) {
    t.center.set(0.5, 0.5);
    t.rotation = Math.PI / 2;
  }
  return t;
}

function Book() {
  const group = useRef<THREE.Group>(null);
  const [front, spine] = useLoader(THREE.TextureLoader, ["/media/cover-flat.jpg", "/media/spine.jpg"]);

  const materials = useMemo(() => {
    [front, spine].forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
    });
    const cloth = { roughness: 0.7, metalness: 0.05, envMapIntensity: 0.4 };
    const side = new THREE.MeshStandardMaterial({ map: pagesTexture(false), roughness: 0.4, metalness: 0.35 });
    const topBottom = new THREE.MeshStandardMaterial({ map: pagesTexture(true), roughness: 0.4, metalness: 0.35 });
    // BoxGeometry face order: +x, -x, +y, -y, +z, -z
    return [
      side,
      new THREE.MeshStandardMaterial({ map: spine, ...cloth }),
      topBottom,
      topBottom,
      new THREE.MeshStandardMaterial({ map: front, ...cloth }),
      new THREE.MeshStandardMaterial({ color: "#1b2531", ...cloth }),
    ];
  }, [front, spine]);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const p = bookState.progress;
    // 0 → 0.55: the book spins in from the back, settling on its cover
    const spin = THREE.MathUtils.smoothstep(p, 0, 0.55);
    const targetY = THREE.MathUtils.lerp(-Math.PI * 2.6, -0.32, spin) + bookState.pointer.x * 0.25;
    const targetX = THREE.MathUtils.lerp(0.5, 0.06, spin) - bookState.pointer.y * 0.15;
    const targetZ = THREE.MathUtils.lerp(-0.4, 0, spin);
    const k = 1 - Math.exp(-dt * 5);
    g.rotation.y += (targetY - g.rotation.y) * k;
    g.rotation.x += (targetX - g.rotation.x) * k;
    g.rotation.z += (targetZ - g.rotation.z) * k;
    const s = THREE.MathUtils.lerp(0.55, 1, spin);
    g.scale.setScalar(g.scale.x + (s - g.scale.x) * k);
    // after it lands, it slides aside to make room for the copy
    const slide = THREE.MathUtils.smoothstep(p, 0.6, 0.9);
    const vw = state.viewport.width;
    const tx = vw > 6 ? THREE.MathUtils.lerp(0, -vw * 0.2, slide) : 0;
    g.position.x += (tx - g.position.x) * k;
  });

  return (
    <group ref={group}>
      <mesh material={materials} castShadow>
        <boxGeometry args={[W, H, D]} />
      </mesh>
    </group>
  );
}

function Coins({ count = 46 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        r: 2.2 + Math.random() * 3.2,
        a: Math.random() * Math.PI * 2,
        y: (Math.random() - 0.5) * 5,
        s: 0.15 + Math.random() * 0.35,
        spin: Math.random() * 3,
        size: 0.7 + Math.random() * 0.6,
      })),
    [count],
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = bookState.progress;
    seeds.forEach((c, i) => {
      const a = c.a + t * c.s * 0.4 + p * 2;
      dummy.position.set(Math.cos(a) * c.r, c.y + Math.sin(t * c.s + i) * 0.3 - p * 1.5, Math.sin(a) * c.r - 1.5);
      dummy.rotation.set(t * c.spin, t * c.spin * 0.7, 0);
      dummy.scale.setScalar(c.size);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current!.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <cylinderGeometry args={[0.12, 0.12, 0.022, 28]} />
      <meshStandardMaterial color="#e2b65c" metalness={0.85} roughness={0.3} emissive="#5a3a08" emissiveIntensity={0.6} />
    </instancedMesh>
  );
}

export default function BookScene() {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 6.2], fov: 38 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[4, 6, 6]} angle={0.5} penumbra={0.8} intensity={34} color="#fff1dc" />
      <pointLight position={[-4, -2, 3]} intensity={5} color="#ff9a4a" />
      <directionalLight position={[0, 1, 5]} intensity={0.6} color="#dfe8ff" />
      <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.5}>
        <Book />
      </Float>
      <Coins />
      <Sparkles count={70} scale={[9, 6, 4]} size={2.4} speed={0.3} color="#f3dd9f" opacity={0.7} />
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={3} color="#ffe2a8" position={[0, 4, -6]} scale={[10, 3, 1]} />
        <Lightformer form="rect" intensity={2} color="#ff8a3a" position={[-6, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 4, 1]} />
        <Lightformer form="ring" intensity={2.5} color="#ffffff" position={[5, 2, 4]} scale={2} />
      </Environment>
    </Canvas>
  );
}
