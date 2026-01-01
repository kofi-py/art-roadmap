'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Box, Sphere, Cone, Tetrahedron, PerspectiveCamera, ContactShadows, Environment } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function BackgroundElements() {
  const columns = 5;
  const rows = 3;
  const shapes = useMemo(() => {
    const arr = [];
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        arr.push({
          type: ['box', 'sphere', 'cone', 'tetrahedron'][(i + j) % 4],
          position: [
            (i - (columns - 1) / 2) * 8,
            (j - (rows - 1) / 2) * 6,
            -5
          ],
          scale: 0.7,
          rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
          color: ['#F43F5E', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#A855F7'][(i + j) % 6],
          speed: 0.8 + Math.random() * 0.4,
        });
      }
    }
    return arr;
  }, []);

  return (
    <>
      <ContactShadows 
        opacity={0.4} 
        scale={40} 
        blur={2} 
        far={15} 
        resolution={256} 
        color="#000000" 
      />
      {shapes.map((shape, i) => (
        <Float
          key={i}
          speed={shape.speed}
          rotationIntensity={2}
          floatIntensity={3}
          position={shape.position}
        >
          {shape.type === 'box' && (
            <Box args={[1, 1, 1]} scale={shape.scale} rotation={shape.rotation} castShadow receiveShadow>
              <meshStandardMaterial color={shape.color} roughness={0.3} metalness={0.2} />
            </Box>
          )}
          {shape.type === 'sphere' && (
            <Sphere args={[1, 32, 32]} scale={shape.scale} castShadow receiveShadow>
              <meshStandardMaterial color={shape.color} roughness={0.3} metalness={0.2} />
            </Sphere>
          )}
          {shape.type === 'cone' && (
            <Cone args={[1, 2, 32]} scale={shape.scale} rotation={shape.rotation} castShadow receiveShadow>
              <meshStandardMaterial color={shape.color} roughness={0.3} metalness={0.2} />
            </Cone>
          )}
          {shape.type === 'tetrahedron' && (
            <Tetrahedron args={[1, 0]} scale={shape.scale} rotation={shape.rotation} castShadow receiveShadow>
              <meshStandardMaterial color={shape.color} roughness={0.3} metalness={0.2} />
            </Tetrahedron>
          )}
        </Float>
      ))}
    </>
  );
}

export default function ThreeScene() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 15]} />
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1} 
          castShadow 
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-10, 10, 10]} intensity={1} color="#ffffff" />
        <Environment preset="city" />
        <BackgroundElements />
      </Canvas>
    </div>
  );
}
