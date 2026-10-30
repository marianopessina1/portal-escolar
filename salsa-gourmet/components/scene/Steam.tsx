"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createSmokeTexture } from "./textures";

const COUNT = 16;

/** Light wisps of steam rising from the lid — sprites always face the camera. */
export default function Steam() {
  const group = useRef<THREE.Group>(null!);
  const tex = useMemo(() => createSmokeTexture(), []);
  const seeds = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => ({
        offset: i / COUNT,
        speed: 0.09 + Math.random() * 0.06,
        drift: (Math.random() - 0.5) * 0.8,
        phase: Math.random() * Math.PI * 2,
        rot: (Math.random() - 0.5) * 0.6,
      })),
    [],
  );
  const materials = useMemo(
    () =>
      seeds.map(
        () =>
          new THREE.SpriteMaterial({
            map: tex,
            color: "#ffd9bf",
            transparent: true,
            depthWrite: false,
            opacity: 0,
          }),
      ),
    [seeds, tex],
  );

  useEffect(() => () => { tex.dispose(); materials.forEach((m) => m.dispose()); }, [tex, materials]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      const s = seeds[i];
      const life = (t * s.speed + s.offset) % 1;
      const sprite = child as THREE.Sprite;
      sprite.position.set(
        Math.sin(t * 0.7 + s.phase) * 0.18 * life + s.drift * life,
        1.35 + life * 2.1,
        Math.cos(t * 0.5 + s.phase) * 0.15,
      );
      const scale = 0.4 + life * 1.4;
      sprite.scale.set(scale, scale, 1);
      const m = materials[i];
      m.rotation = s.phase + t * s.rot;
      m.opacity = Math.sin(Math.PI * life) * 0.1;
    });
  });

  return (
    <group ref={group}>
      {materials.map((m, i) => (
        <sprite key={i} material={m} />
      ))}
    </group>
  );
}
