'use client';
import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { CRTMonitor } from './CRTMonitor';
import { Terminal } from '@/components/terminal/Terminal';

export function Scene() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 860);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // For mobile viewports (< 860px), render high-performance direct 2D terminal with CRT overlay
  // This guarantees buttery 60fps performance and instant touch interaction on mobile devices
  if (isMobile) {
    return (
      <div className="w-full h-full p-2 sm:p-4 flex items-center justify-center">
        <div className="w-full max-w-4xl h-[92vh]">
          <Terminal />
        </div>
      </div>
    );
  }

  // Full 3D CRT Canvas for desktop and tablets
  return (
    <div className="relative w-full h-full select-none">
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 8, 4]} intensity={0.8} color="#fff" />
          <pointLight position={[0, 0, 2]} intensity={0.6} color="#ffb000" distance={6} />

          {/* Deep Space Background Environment */}
          <Stars radius={60} depth={50} count={1200} factor={3} fade speed={0.8} />

          {/* Perspective grid floor */}
          <gridHelper
            args={[40, 40, '#ffb000', '#221500']}
            position={[0, -2.5, 0]}
            rotation={[0, 0, 0]}
          />

          {/* 3D CRT Floating Monitor */}
          <CRTMonitor />
        </Suspense>
      </Canvas>
    </div>
  );
}
