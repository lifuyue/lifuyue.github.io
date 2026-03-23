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

    meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.22;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.65} floatIntensity={1.2}>
      <mesh ref={meshRef} position={[2.1, 0.1, 0]}>
        <icosahedronGeometry args={[1.1, 1]} />
        <MeshDistortMaterial
          color="#f59e0b"
          distort={0.35}
          speed={1.5}
          roughness={0.1}
          metalness={0.35}
          transparent
          opacity={0.92}
        />
      </mesh>
    </Float>
  );
}
