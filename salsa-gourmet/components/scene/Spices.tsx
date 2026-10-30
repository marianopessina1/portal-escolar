"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { jarState } from "@/lib/jarState";

type Particle = {
  radius: number;
  angle: number;
  speed: number;
  y: number;
  bob: number;
  phase: number;
  spin: THREE.Vector3;
  scale: THREE.Vector3;
};

function makeParticles(n: number, flat: boolean): Particle[] {
  return Array.from({ length: n }, () => {
    const s = flat ? 0.03 + Math.random() * 0.06 : 0.025 + Math.random() * 0.025;
    return {
      radius: 1.5 + Math.random() * 2.4,
      angle: Math.random() * Math.PI * 2,
      speed: (0.08 + Math.random() * 0.18) * (Math.random() > 0.5 ? 1 : -1),
      y: -1.9 + Math.random() * 4.2,
      bob: 0.05 + Math.random() * 0.2,
      phase: Math.random() * Math.PI * 2,
      spin: new THREE.Vector3(Math.random(), Math.random(), Math.random()).multiplyScalar(1.6),
      scale: flat ? new THREE.Vector3(s, s * 0.25, s * (0.6 + Math.random() * 0.8)) : new THREE.Vector3(s, s, s),
    };
  });
}

const FLAKE_COLORS = ["#ff4a0f", "#d7261e", "#ff8a1f", "#8f1b0c", "#ffb341", "#5a1408"];

/** Orbiting chili flakes, peppercorns and seeds — instanced for performance. */
export default function Spices() {
  const flakes = useRef<THREE.InstancedMesh>(null!);
  const corns = useRef<THREE.InstancedMesh>(null!);
  const seeds = useRef<THREE.InstancedMesh>(null!);
  const flakeData = useMemo(() => makeParticles(140, true), []);
  const cornData = useMemo(() => makeParticles(46, false), []);
  const seedData = useMemo(() => makeParticles(60, true).map((p) => ({ ...p, scale: p.scale.clone().multiplyScalar(0.55) })), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useLayoutEffect(() => {
    const c = new THREE.Color();
    flakeData.forEach((_, i) => {
      flakes.current.setColorAt(i, c.set(FLAKE_COLORS[i % FLAKE_COLORS.length]));
    });
    if (flakes.current.instanceColor) flakes.current.instanceColor.needsUpdate = true;
  }, [flakeData]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const turbulence = 1 + Math.min(Math.abs(jarState.velocity) * 0.004, 3);
    const update = (mesh: THREE.InstancedMesh, data: Particle[]) => {
      data.forEach((p, i) => {
        p.angle += p.speed * Math.min(delta, 0.05) * turbulence;
        dummy.position.set(
          Math.cos(p.angle) * p.radius,
          p.y + Math.sin(t * 0.8 + p.phase) * p.bob,
          Math.sin(p.angle) * p.radius * 0.7,
        );
        dummy.rotation.set(t * p.spin.x + p.phase, t * p.spin.y, t * p.spin.z);
        dummy.scale.copy(p.scale);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    };
    update(flakes.current, flakeData);
    update(corns.current, cornData);
    update(seeds.current, seedData);
  });

  return (
    <group>
      <instancedMesh ref={flakes} args={[undefined, undefined, flakeData.length]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial roughness={0.55} metalness={0.05} />
      </instancedMesh>
      <instancedMesh ref={corns} args={[undefined, undefined, cornData.length]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#1b120d" roughness={0.75} />
      </instancedMesh>
      <instancedMesh ref={seeds} args={[undefined, undefined, seedData.length]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color="#f2d7a0" roughness={0.6} />
      </instancedMesh>
    </group>
  );
}
