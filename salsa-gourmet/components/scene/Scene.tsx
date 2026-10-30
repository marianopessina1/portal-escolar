"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { flavors } from "@/lib/data";
import { jarState } from "@/lib/jarState";
import Jar from "./Jar";
import Steam from "./Steam";
import Spices from "./Spices";
import { createGlowTexture } from "./textures";

/** Moves the whole jar rig to the position the scroll choreography asks for. */
function Rig() {
  const root = useRef<THREE.Group>(null!);
  const spices = useRef<THREE.Group>(null!);
  const glow = useRef<THREE.SpriteMaterial>(null!);
  const key = useRef<THREE.SpotLight>(null!);
  const follow = useRef<THREE.PointLight>(null!);
  const rim = useRef<THREE.PointLight>(null!);
  const glowTex = useMemo(() => createGlowTexture(), []);
  const glowTarget = useMemo(() => new THREE.Color(), []);
  const { viewport } = useThree();

  useEffect(() => () => glowTex.dispose(), [glowTex]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const narrow = viewport.width < viewport.height; // portrait / mobile
    const ease = 1 - Math.pow(0.0015, dt);

    // position & scale
    const tx = jarState.x * (viewport.width / 2) * (narrow ? 0.25 : 1);
    const ty = jarState.y * (viewport.height / 2);
    const base = narrow ? viewport.width / 5.2 : Math.min(viewport.height / 5.6, viewport.width / 7);
    const ts = jarState.scale * base;
    const g = root.current;
    g.position.x += (tx - g.position.x) * ease;
    g.position.y += (ty - g.position.y) * ease;
    const s = g.scale.x + (ts - g.scale.x) * ease;
    g.scale.setScalar(Math.max(s, 0.0001));
    g.visible = s > 0.01;

    // decay scroll velocity so turbulence settles
    jarState.velocity *= Math.pow(0.08, dt);

    // spices drift with the pointer for parallax depth
    spices.current.rotation.y += (jarState.pointer.x * 0.4 - spices.current.rotation.y) * ease * 0.5;
    spices.current.rotation.x += (-jarState.pointer.y * 0.2 - spices.current.rotation.x) * ease * 0.5;

    // halo follows active flavour
    glowTarget.set(flavors[jarState.flavor].accent);
    glow.current.color.lerp(glowTarget, 1 - Math.pow(0.05, dt));
    glow.current.opacity = 0.32 + Math.sin(t * 1.4) * 0.05;

    // dynamic lighting: orbiting warm key, pointer-following fill, pulsing rim
    key.current.position.set(Math.cos(t * 0.3) * 7, 6 + Math.sin(t * 0.5), Math.sin(t * 0.3) * 5 + 4);
    follow.current.position.set(
      g.position.x + jarState.pointer.x * 4,
      g.position.y + jarState.pointer.y * 3,
      3.5,
    );
    rim.current.intensity = 60 + Math.sin(t * 2.1) * 12 + Math.sin(t * 5.3) * 6; // ember flicker
    rim.current.position.set(g.position.x - 2.5, g.position.y + 1, -3);
  });

  return (
    <>
      <ambientLight intensity={0.18} />
      <spotLight ref={key} color="#ffd2a6" intensity={180} angle={0.5} penumbra={1} decay={2} />
      <pointLight ref={follow} color="#ff8a3d" intensity={22} distance={12} decay={2} />
      <pointLight ref={rim} color="#ff4a0f" intensity={60} distance={14} decay={2} />

      <group ref={root}>
        <sprite position={[0, 0.2, -2.5]} scale={[7, 7, 1]}>
          <spriteMaterial ref={glow} map={glowTex} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
        <Jar />
        <Steam />
        <group ref={spices}>
          <Spices />
        </group>
      </group>
    </>
  );
}

export default function Scene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 10], fov: 35 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <Suspense fallback={null}>
        <Rig />
        {/* studio light rig baked into an env map — gives the glass its long vertical highlights */}
        <Environment resolution={256}>
          <group rotation={[-Math.PI / 3, 0, 0]}>
            <Lightformer form="rect" intensity={4} position={[0, 5, -9]} scale={[10, 10, 1]} />
            <Lightformer form="rect" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[20, 0.5, 1]} />
            <Lightformer form="rect" intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 1, 1]} />
            <Lightformer form="rect" color="#ff6a1f" intensity={3} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[20, 0.6, 1]} />
            <Lightformer form="ring" color="#ffb341" intensity={6} scale={2} position={[-6, 4, 6]} onUpdate={(self) => self.lookAt(0, 0, 0)} />
          </group>
        </Environment>
      </Suspense>
    </Canvas>
  );
}
