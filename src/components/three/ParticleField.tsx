import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useCurrentTheme } from '@/hooks/useCurrentTheme';

export function ParticleField() {
  const theme = useCurrentTheme();
  const pointsRef = useRef<THREE.Points>(null);
  const lineAttributeRefs = useRef<Array<THREE.BufferAttribute | null>>([]);
  const positions = useMemo(() => {
    const count = typeof window !== 'undefined' && window.innerWidth < 768 ? 1200 : 2400;
    const array = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      const stride = index * 3;
      array[stride] = (Math.random() - 0.5) * 14;
      array[stride + 1] = (Math.random() - 0.5) * 10;
      array[stride + 2] = (Math.random() - 0.5) * 6;
    }

    return array;
  }, []);
  const lineConfigs = useMemo(
    () => [
      {
        basePoints: [
          [-3.5, 1.4, -1.2],
          [-1.2, 0.1, 0.6],
          [0.8, 1.6, 0.1],
          [3.4, -0.4, -0.8],
        ] as const,
        color: '#5eead4',
        opacity: theme === 'light' ? 0.22 : 0.35,
        amplitude: [0.16, 0.2, 0.12] as const,
        frequency: [0.42, 0.31, 0.26] as const,
        phase: 0.55,
      },
      {
        basePoints: [
          [-4.1, -1.8, -0.7],
          [-2.2, -0.8, 0.5],
          [0.4, -1.4, 0.3],
          [3.2, -2.1, -0.4],
        ] as const,
        color: theme === 'light' ? '#1e293b' : '#ffffff',
        opacity: theme === 'light' ? 0.14 : 0.18,
        amplitude: [0.14, 0.18, 0.13] as const,
        frequency: [0.36, 0.28, 0.22] as const,
        phase: 1.2,
      },
    ],
    [theme],
  );
  const lineBasePositions = useMemo(
    () =>
      lineConfigs.map(({ basePoints }) =>
        Float32Array.from(basePoints.flatMap((point) => point)),
      ),
    [lineConfigs],
  );
  const linePositions = useMemo(
    () => lineBasePositions.map((basePositions) => new Float32Array(basePositions)),
    [lineBasePositions],
  );

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

    const t = state.clock.elapsedTime;

    lineBasePositions.forEach((basePositions, lineIndex) => {
      const positionsArray = linePositions[lineIndex];
      const { amplitude, frequency, phase } = lineConfigs[lineIndex];

      for (let index = 0; index < basePositions.length; index += 3) {
        const pointIndex = index / 3;
        positionsArray[index] =
          basePositions[index] +
          Math.sin(t * frequency[0] + pointIndex * 0.65 + phase) *
            (amplitude[0] + pointIndex * 0.02);
        positionsArray[index + 1] =
          basePositions[index + 1] +
          Math.sin(t * frequency[1] + pointIndex * 0.78 + phase * 1.4) *
            (amplitude[1] + pointIndex * 0.015);
        positionsArray[index + 2] =
          basePositions[index + 2] +
          Math.cos(t * frequency[2] + pointIndex * 0.52 + phase * 0.9) *
            (amplitude[2] + pointIndex * 0.01);
      }

      const attribute = lineAttributeRefs.current[lineIndex];

      if (attribute) {
        attribute.needsUpdate = true;
      }
    });
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
          size={0.03}
          sizeAttenuation
          transparent
          opacity={theme === 'light' ? 0.55 : 0.9}
        />
      </points>
      {lineConfigs.map(({ color, opacity }, index) => (
        <line key={color}>
          <bufferGeometry>
            <bufferAttribute
              ref={(attribute) => {
                lineAttributeRefs.current[index] = attribute;
              }}
              attach="attributes-position"
              args={[linePositions[index], 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color={color} transparent opacity={opacity} />
        </line>
      ))}
    </group>
  );
}
