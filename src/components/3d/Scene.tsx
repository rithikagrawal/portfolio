'use client';
import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import { CRTMonitor } from './CRTMonitor';
import { Terminal } from '@/components/terminal/Terminal';
import { useTerminalStore } from '@/store/terminal';

export function Scene() {
  const [isMobile, setIsMobile] = useState(false);
  const viewMode = useTerminalStore((s) => s.viewMode);
  const isOrbitMode = useTerminalStore((s) => s.isOrbitMode);
  const sceneMode = useTerminalStore((s) => s.sceneMode);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 860);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // For mobile viewports (< 860px), render high-performance direct 2D terminal with CRT overlay
  // When in GUI mode, return null so the 2D terminal window is closed
  if (isMobile) {
    if (viewMode === 'gui') return null;
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
          {/* Optional 360° Orbit Controls */}
          {isOrbitMode && (
            <OrbitControls
              enableDamping
              dampingFactor={0.05}
              maxDistance={9.5}
              minDistance={3.2}
            />
          )}

          {/* Lighting */}
          <ambientLight intensity={sceneMode === 'desk' ? 0.35 : 0.4} />
          <directionalLight position={[5, 8, 4]} intensity={0.8} color="#fff" />
          <pointLight position={[0, 0, 2]} intensity={0.6} color="#ffb000" distance={6} />

          {/* Deep Space Background Environment */}
          <Stars radius={60} depth={50} count={1200} factor={3} fade speed={0.8} />

          {/* Perspective grid floor or Retro 3D Desk */}
          {sceneMode === 'cosmos' ? (
            <gridHelper
              args={[40, 40, '#ffb000', '#221500']}
              position={[0, -2.5, 0]}
              rotation={[0, 0, 0]}
            />
          ) : (
            <group position={[0, 0, 0]}>
              {/* Wooden Desk Surface */}
              <mesh position={[0, -2.36, 0.4]}>
                <boxGeometry args={[12, 0.2, 5.5]} />
                <meshStandardMaterial color="#2d1f14" roughness={0.7} metalness={0.1} />
              </mesh>

              {/* Retro Mechanical Keyboard Body */}
              <mesh position={[0, -2.2, 1.4]}>
                <boxGeometry args={[3.2, 0.12, 1.1]} />
                <meshStandardMaterial color="#1a1816" roughness={0.5} metalness={0.2} />
              </mesh>

              {/* Ceramic Coffee Mug */}
              <mesh position={[2.4, -2.08, 1.1]}>
                <cylinderGeometry args={[0.18, 0.15, 0.38, 16]} />
                <meshStandardMaterial color="#e5ded4" roughness={0.3} />
              </mesh>

              {/* 3.5" Floppy Disk labeled RESUME */}
              <mesh
                position={[-2.2, -2.24, 1.2]}
                rotation={[-Math.PI / 2, 0, 0.25]}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open('/resume.pdf', '_blank');
                }}
              >
                <boxGeometry args={[0.55, 0.55, 0.03]} />
                <meshStandardMaterial color="#1c1926" roughness={0.4} />
              </mesh>

              {/* Desk Lamp Warm Glow Spotlight */}
              <spotLight
                position={[-3.5, 0.5, 1.5]}
                color="#fff5dd"
                intensity={2.2}
                angle={0.65}
                penumbra={0.4}
              />
            </group>
          )}

          {/* 3D CRT Floating Monitor */}
          <CRTMonitor />
        </Suspense>
      </Canvas>
    </div>
  );
}
