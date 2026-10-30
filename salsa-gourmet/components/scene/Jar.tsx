"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { flavors } from "@/lib/data";
import { jarState } from "@/lib/jarState";
import { createLabelTexture, createSauceTexture } from "./textures";

/** Glass profile (radius, height) revolved around Y. Units ≈ jar radius. */
const GLASS_PROFILE: [number, number][] = [
  [0, 0.02], [0.82, 0.0], [0.94, 0.03], [0.995, 0.1], [1.0, 0.22],
  [1.0, 1.72], [0.985, 1.86], [0.94, 1.98], [0.86, 2.07], [0.8, 2.12],
  [0.79, 2.18], [0.81, 2.2], [0.81, 2.24], [0.79, 2.26], [0.79, 2.32],
];

/** Sauce fills ~80% with a slight meniscus at the top. */
const SAUCE_PROFILE: [number, number][] = [
  [0, 0.07], [0.9, 0.07], [0.95, 0.12], [0.955, 0.24],
  [0.955, 1.74], [0.94, 1.8], [0.6, 1.81], [0, 1.815],
];

const toVec2 = (p: [number, number][]) => p.map(([x, y]) => new THREE.Vector2(x, y));

function knurledLid() {
  const geo = new THREE.CylinderGeometry(0.86, 0.86, 0.34, 192, 6, false);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const r = Math.hypot(v.x, v.z);
    // only push the side wall — leave the caps flat
    if (r > 0.85 && Math.abs(v.y) < 0.16) {
      const a = Math.atan2(v.z, v.x);
      const ridge = 1 + 0.012 * Math.sign(Math.sin(a * 72));
      v.x *= ridge;
      v.z *= ridge;
      pos.setXYZ(i, v.x, v.y, v.z);
    }
  }
  geo.computeVertexNormals();
  return geo;
}

export default function Jar() {
  const spin = useRef<THREE.Group>(null!);
  const sauceMat = useRef<THREE.MeshPhysicalMaterial>(null!);
  const labelMat = useRef<THREE.MeshStandardMaterial>(null!);
  const ringMat = useRef<THREE.MeshStandardMaterial>(null!);
  const currentFlavor = useRef(-1);
  const targetSauce = useMemo(() => new THREE.Color(flavors[0].sauce), []);
  const targetAccent = useMemo(() => new THREE.Color(flavors[0].accent), []);

  const glassGeo = useMemo(() => new THREE.LatheGeometry(toVec2(GLASS_PROFILE), 128), []);
  const sauceGeo = useMemo(() => new THREE.LatheGeometry(toVec2(SAUCE_PROFILE), 96), []);
  const lidGeo = useMemo(knurledLid, []);
  const labelGeo = useMemo(
    // open cylinder segment wrapped around ~78% of the jar, centred at the front
    () => new THREE.CylinderGeometry(1.012, 1.012, 1.08, 128, 1, true, Math.PI * 0.22 + Math.PI / 2, Math.PI * 1.56),
    [],
  );
  const labels = useMemo(() => flavors.map((f, i) => createLabelTexture(f, i)), []);
  const sauceTex = useMemo(() => createSauceTexture(), []);

  useEffect(
    () => () => {
      labels.forEach((t) => t.dispose());
      sauceTex.dispose();
      [glassGeo, sauceGeo, lidGeo, labelGeo].forEach((g) => g.dispose());
    },
    [labels, sauceTex, glassGeo, sauceGeo, lidGeo, labelGeo],
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;

    // flavour swap: label switches instantly (hidden by the spin), colours ease
    const f = jarState.flavor;
    if (f !== currentFlavor.current) {
      currentFlavor.current = f;
      labelMat.current.map = labels[f];
      labelMat.current.needsUpdate = true;
      targetSauce.set(flavors[f].sauce);
      targetAccent.set(flavors[f].accent);
    }
    sauceMat.current.color.lerp(targetSauce, 1 - Math.pow(0.02, dt));
    sauceMat.current.sheenColor.lerp(targetAccent, 1 - Math.pow(0.02, dt));
    ringMat.current.color.lerp(targetAccent, 1 - Math.pow(0.02, dt));

    // fluid idle rotation + scroll-driven spin + pointer tilt
    const g = spin.current;
    const idle = t * 0.35;
    const targetY = idle + jarState.spin + jarState.pointer.x * 0.35;
    g.rotation.y += (targetY - g.rotation.y) * (1 - Math.pow(0.001, dt));
    const targetX = -jarState.pointer.y * 0.18 + Math.sin(t * 0.8) * 0.03;
    const lean = THREE.MathUtils.clamp(jarState.velocity * 0.0006, -0.12, 0.12);
    const targetZ = Math.sin(t * 0.6) * 0.04 - lean;
    g.rotation.x += (targetX - g.rotation.x) * (1 - Math.pow(0.01, dt));
    g.rotation.z += (targetZ - g.rotation.z) * (1 - Math.pow(0.01, dt));
    g.position.y = Math.sin(t * 1.1) * 0.06;
  });

  return (
    <group ref={spin}>
      <group position={[0, -1.2, 0]}>
        {/* sauce */}
        <mesh geometry={sauceGeo} castShadow>
          <meshPhysicalMaterial
            ref={sauceMat}
            map={sauceTex}
            color={flavors[0].sauce}
            roughness={0.28}
            clearcoat={0.8}
            clearcoatRoughness={0.25}
            sheen={0.6}
            sheenRoughness={0.4}
            sheenColor={flavors[0].accent}
          />
        </mesh>

        {/* glass */}
        <mesh geometry={glassGeo} renderOrder={2}>
          <meshPhysicalMaterial
            color="#fff7ef"
            transmission={1}
            thickness={0.35}
            roughness={0.04}
            ior={1.5}
            clearcoat={1}
            clearcoatRoughness={0.05}
            envMapIntensity={1.1}
            specularIntensity={1}
            attenuationColor="#ffd9b8"
            attenuationDistance={4}
            transparent
          />
        </mesh>

        {/* paper label */}
        <mesh geometry={labelGeo} position={[0, 0.98, 0]}>
          <meshStandardMaterial ref={labelMat} map={labels[0]} roughness={0.62} metalness={0.05} />
        </mesh>

        {/* lid */}
        <group position={[0, 2.42, 0]}>
          <mesh geometry={lidGeo} castShadow>
            <meshStandardMaterial color="#0c0a09" metalness={0.85} roughness={0.32} envMapIntensity={1.4} />
          </mesh>
          {/* embossed top ring */}
          <mesh position={[0, 0.172, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.52, 0.62, 96]} />
            <meshStandardMaterial ref={ringMat} color={flavors[0].accent} metalness={0.9} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.171, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.86, 96]} />
            <meshStandardMaterial color="#141110" metalness={0.7} roughness={0.45} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
