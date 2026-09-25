'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Terminal } from '@/components/terminal/Terminal';
import { useTerminalStore } from '@/store/terminal';

export function CRTMonitor() {
  const groupRef = useRef<THREE.Group>(null);
  const monitorRef = useRef<THREE.Group>(null);
  const viewMode = useTerminalStore((s) => s.viewMode);

  useFrame(({ clock, pointer }) => {
    if (!monitorRef.current) return;
    const t = clock.getElapsedTime();

    // Gentle organic float
    monitorRef.current.position.y = Math.sin(t * 0.8) * 0.08;

    // Subtle pointer parallax tilt
    const targetRotX = -pointer.y * 0.12;
    const targetRotY = pointer.x * 0.15;
    monitorRef.current.rotation.x = THREE.MathUtils.lerp(monitorRef.current.rotation.x, targetRotX, 0.05);
    monitorRef.current.rotation.y = THREE.MathUtils.lerp(monitorRef.current.rotation.y, targetRotY, 0.05);
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.3}>
        <group ref={monitorRef}>
          {/* Main Monitor Bezel / Enclosure */}
          <mesh position={[0, 0, -0.2]}>
            <boxGeometry args={[4.8, 3.4, 1.2]} />
            <meshStandardMaterial
              color="#12100d"
              roughness={0.7}
              metalness={0.3}
            />
          </mesh>

          {/* Front Bezel Lip */}
          <mesh position={[0, 0, 0.35]}>
            <boxGeometry args={[4.6, 3.2, 0.1]} />
            <meshStandardMaterial
              color="#181510"
              roughness={0.6}
              metalness={0.4}
            />
          </mesh>

          {/* Recessed CRT Screen Glass */}
          <mesh position={[0, 0, 0.41]}>
            <planeGeometry args={[4.2, 2.8]} />
            <meshStandardMaterial
              color="#000000"
              roughness={0.1}
              metalness={0.9}
              emissive="#1a1100"
              emissiveIntensity={0.15}
            />
          </mesh>

          {/* Vintage Badge / Logo on Bezel */}
          <mesh position={[0, -1.5, 0.41]}>
            <planeGeometry args={[0.8, 0.12]} />
            <meshStandardMaterial
              color="#ffb000"
              emissive="#ffb000"
              emissiveIntensity={0.3}
            />
          </mesh>

          {/* Monitor Neck */}
          <mesh position={[0, -1.9, -0.2]}>
            <cylinderGeometry args={[0.2, 0.3, 0.6, 16]} />
            <meshStandardMaterial color="#0e0d0b" metalness={0.6} roughness={0.5} />
          </mesh>

          {/* Monitor Base Plate */}
          <mesh position={[0, -2.2, -0.1]}>
            <boxGeometry args={[2.0, 0.12, 1.8]} />
            <meshStandardMaterial color="#14120e" metalness={0.7} roughness={0.4} />
          </mesh>

          {/* Live DOM Terminal Projected on Screen — Closed when in GUI mode */}
          {viewMode !== 'gui' && (
            <Html
              transform
              position={[0, 0, 0.42]}
              scale={0.25}
              style={{
                width: '840px',
                height: '560px',
              }}
            >
              <div className="w-[840px] h-[560px]">
                <Terminal />
              </div>
            </Html>
          )}
        </group>
      </Float>
    </group>
  );
}
