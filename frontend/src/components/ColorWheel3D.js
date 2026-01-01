'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, TorusKnot, MeshDistortMaterial } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';

function RotatingKnot() {
  const meshRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.5;
    meshRef.current.rotation.y = t * 0.2;
    meshRef.current.position.y = Math.sin(t) * 0.2;
  });

  return (
    <TorusKnot ref={meshRef} args={[1, 0.3, 128, 32]}>
      <MeshDistortMaterial
        color="#F43F5E"
        speed={2}
        distort={0.3}
        radius={1}
      />
    </TorusKnot>
  );
}

export default function ColorWheel3D() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-64 h-64" />;

  return (
    <div className="w-[300px] h-[300px] cursor-grab active:cursor-grabbing">
      <Canvas shadows camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={1} />
        <RotatingKnot />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
