import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useScroll, Image } from "@react-three/drei";
import * as THREE from "three";
import { MathUtils } from "three";

import METEOR_IMAGE_URL from "./metor.png";
// Note: Ensure you have a declaration file for PNG imports, e.g., meteor-png

interface MeteorProps {
  index: number;
  numMeteors: number;
  color: string;
}

export const Meteor: React.FC<MeteorProps> = ({ index, numMeteors, color }) => {
  const meshRef = useRef<THREE.Group>(null!);
  const scrollData = useScroll();
  const { viewport } = useThree();

  const start = index / numMeteors;
  const length = 1 / numMeteors;

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const progress = scrollData.range(start, length);

    // --- Staged Animation for Position, Scale, and Zoom ---
    let x = 0;
    let scale = 0.5;
    let z = 0;
    const flyInEnd = 0.4;
    const pauseEnd = 0.6;

    if (progress < flyInEnd) {
      // Phase 1: Fly In & Zoom In (Right to Center)
      const phaseProgress = progress / flyInEnd;
      const easedPhaseProgress = Math.sin((phaseProgress * Math.PI) / 2); // Ease-out

      x = MathUtils.lerp(viewport.width / 1.5, 0, easedPhaseProgress);
      scale = MathUtils.lerp(0.5, 1.5, easedPhaseProgress);
      z = MathUtils.lerp(0, 4, easedPhaseProgress);
    } else if (progress < pauseEnd) {
      // Phase 2: Pause at Center (Max size)
      x = 0;
      scale = 1.5;
      z = 4;
    } else {
      // Phase 3: Fly Out & Zoom Out (Center to Left)
      const phaseProgress = (progress - pauseEnd) / (1 - pauseEnd);
      const easedPhaseProgress = Math.sin((phaseProgress * Math.PI) / 2); // Ease-in

      x = MathUtils.lerp(0, -viewport.width / 1.5, easedPhaseProgress);
      scale = MathUtils.lerp(1.5, 0.5, easedPhaseProgress);
      z = MathUtils.lerp(4, 0, easedPhaseProgress);
    }

    // Y position still has a slight arc across the whole section
    const y =
      MathUtils.lerp(viewport.height / 4, -viewport.height / 4, progress) * 0.3;

    // Rotation (Rotate when near or at the center)
    if (progress > 0.3 && progress < 0.7) {
      meshRef.current.rotation.z += delta * 0.3;
    }

    // Apply transformations
    meshRef.current.position.set(x, y, z);
    meshRef.current.scale.set(scale, scale, scale);
  });

  return (
    <group ref={meshRef}>
      <Image url={METEOR_IMAGE_URL} transparent color={color} />
      <pointLight color={color} intensity={5} distance={3} />
      {/* Future extension: Add particle trails here using <Sparkles /> or a custom particle system */}
    </group>
  );
};
