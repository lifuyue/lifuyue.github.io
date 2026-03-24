import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { FloatingGeometry } from '@/components/three/FloatingGeometry';
import { ParticleField } from '@/components/three/ParticleField';
import { useCurrentTheme } from '@/hooks/useCurrentTheme';

export default function HeroScene() {
  const theme = useCurrentTheme();

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 1.6]}>
      <Suspense fallback={null}>
        <ambientLight intensity={theme === 'light' ? 0.72 : 0.55} />
        <directionalLight
          position={[3, 4, 2]}
          intensity={theme === 'light' ? 1.5 : 2}
          color="#fde68a"
        />
        <pointLight
          position={[-4, -2, 1]}
          intensity={theme === 'light' ? 8 : 12}
          color="#2dd4bf"
        />
        <ParticleField />
        <FloatingGeometry />
      </Suspense>
    </Canvas>
  );
}
