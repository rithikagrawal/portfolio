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
  const isPoweredOn = useTerminalStore((s) => s.isPoweredOn);
  const togglePower = useTerminalStore((s) => s.togglePower);

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

          {/* Top Cooling Ventilation Slots */}
          <group position={[0, 1.705, -0.2]}>
            {[-1.6, -1.2, -0.8, -0.4, 0, 0.4, 0.8, 1.2, 1.6].map((x, i) => (
              <mesh key={i} position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <boxGeometry args={[0.22, 0.65, 0.02]} />
                <meshStandardMaterial color="#080705" roughness={0.9} metalness={0.1} />
              </mesh>
            ))}
          </group>

          {/* Front Bezel Lip */}
          <mesh position={[0, 0, 0.35]}>
            <boxGeometry args={[4.6, 3.2, 0.1]} />
            <meshStandardMaterial
              color="#181510"
              roughness={0.6}
              metalness={0.4}
            />
          </mesh>

          {/* Recessed CRT Screen Glass — Reacts to Power State */}
          <mesh position={[0, 0, 0.41]}>
            <planeGeometry args={[4.2, 2.8]} />
            <meshStandardMaterial
              color="#020202"
              roughness={0.15}
              metalness={0.85}
              emissive={isPoweredOn ? '#241400' : '#000000'}
              emissiveIntensity={isPoweredOn ? 0.22 : 0.0}
            />
          </mesh>

          {/* Model Decal on Left Bezel */}
          <mesh position={[-1.4, -1.5, 0.41]}>
            <planeGeometry args={[1.0, 0.08]} />
            <meshStandardMaterial
              color="#2a2520"
              roughness={0.8}
            />
          </mesh>

          {/* Vintage Badge / Logo on Bezel */}
          <mesh position={[0, -1.5, 0.41]}>
            <planeGeometry args={[0.8, 0.12]} />
            <meshStandardMaterial
              color={isPoweredOn ? '#ffb000' : '#554000'}
              emissive={isPoweredOn ? '#ffb000' : '#221500'}
              emissiveIntensity={isPoweredOn ? 0.4 : 0.05}
            />
          </mesh>

          {/* Retro Dial Knobs on Bezel */}
          <mesh position={[0.9, -1.5, 0.43]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.055, 0.055, 0.05, 16]} />
            <meshStandardMaterial color="#2a2622" roughness={0.5} metalness={0.6} />
          </mesh>
          <mesh position={[1.2, -1.5, 0.43]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.055, 0.055, 0.05, 16]} />
            <meshStandardMaterial color="#2a2622" roughness={0.5} metalness={0.6} />
          </mesh>

          {/* CRT Status LED Indicator */}
          <group position={[1.55, -1.5, 0.42]}>
            <mesh>
              <sphereGeometry args={[0.045, 16, 16]} />
              <meshStandardMaterial
                color={isPoweredOn ? '#00ff41' : '#ff2222'}
                emissive={isPoweredOn ? '#00ff41' : '#ff1111'}
                emissiveIntensity={isPoweredOn ? 3.0 : 0.8}
                roughness={0.2}
              />
            </mesh>
            <pointLight
              color={isPoweredOn ? '#00ff41' : '#ff2222'}
              intensity={isPoweredOn ? 0.8 : 0.2}
              distance={0.5}
              position={[0, 0, 0.06]}
            />
          </group>

          {/* Interactive 3D Bezel Power Push-Button */}
          <group
            position={[1.92, -1.5, 0.41]}
            onClick={(e) => {
              e.stopPropagation();
              togglePower();
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              document.body.style.cursor = 'auto';
            }}
          >
            {/* Button Housing Frame */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.22, 0.22, 0.04]} />
              <meshStandardMaterial color="#0c0b09" roughness={0.7} metalness={0.3} />
            </mesh>
            {/* Push-Button Rocker */}
            <mesh position={[0, 0, isPoweredOn ? 0.025 : 0.015]}>
              <boxGeometry args={[0.16, 0.16, 0.04]} />
              <meshStandardMaterial
                color={isPoweredOn ? '#3a3228' : '#221e1a'}
                emissive={isPoweredOn ? '#ffb000' : '#000000'}
                emissiveIntensity={isPoweredOn ? 0.15 : 0.0}
                roughness={0.4}
                metalness={0.5}
              />
            </mesh>
          </group>

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
