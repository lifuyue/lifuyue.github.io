import { Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

export function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = typeof window !== 'undefined' && window.innerWidth < 768 ? 1800 : 3200;
    const array = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      const stride = index * 3;
      array[stride] = (Math.random() - 0.5) * 14;
      array[stride + 1] = (Math.random() - 0.5) * 10;
      array[stride + 2] = (Math.random() - 0.5) * 6;
    }

    return array;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) {
      return;
    }

    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    pointsRef.current.rotation.x = state.pointer.y * 0.12;
    pointsRef.current.position.x = THREE.MathUtils.lerp(
      pointsRef.current.position.x,
      state.pointer.x * 0.5,
      0.06,
    );
    pointsRef.current.position.y = THREE.MathUtils.lerp(
      pointsRef.current.position.y,
      state.pointer.y * 0.35,
      0.06,
    );
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#fbbf24"
          size={0.025}
          sizeAttenuation
          transparent
          opacity={0.9}
        />
      </points>
      <Line
        points={[
          [-3.5, 1.4, -1.2],
          [-1.2, 0.1, 0.6],
          [0.8, 1.6, 0.1],
          [3.4, -0.4, -0.8],
        ]}
        color="#5eead4"
        transparent
        opacity={0.35}
        lineWidth={1}
      />
      <Line
        points={[
          [-4.1, -1.8, -0.7],
          [-2.2, -0.8, 0.5],
          [0.4, -1.4, 0.3],
          [3.2, -2.1, -0.4],
        ]}
        color="#ffffff"
        transparent
        opacity={0.18}
        lineWidth={1}
      />
    </group>
  );
}
