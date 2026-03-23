import { Float, MeshDistortMaterial } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export function FloatingGeometry() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) {
      return;
    }

    const t = state.clock.elapsedTime;
    const baseX = Math.sin(t * 0.3) * 0.4 + Math.sin(t * 0.17) * 0.15;
    const baseY = Math.sin(t * 0.22) * 0.5 + Math.cos(t * 0.13) * 0.2;

    meshRef.current.rotation.x = baseX + state.pointer.y * 0.1;
    meshRef.current.rotation.y = baseY + state.pointer.x * 0.15;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.65} floatIntensity={1.2}>
      <mesh ref={meshRef} position={[3, -0.2, -0.35]} scale={0.76}>
        <icosahedronGeometry args={[1.1, 1]} />
        <MeshDistortMaterial
          color="#d97706"
          distort={0.25}
          speed={0.8}
          roughness={0.18}
          metalness={0.22}
          transparent
          opacity={0.78}
        />
      </mesh>
    </Float>
  );
}
