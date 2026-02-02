import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, PresentationControls, Float } from '@react-three/drei';
import { gsap } from 'gsap';

function TrophyModel({ position, rotation, scale }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    meshRef.current.rotation.y += 0.01;
  });

  useEffect(() => {
    gsap.to(meshRef.current.position, {
      y: '+=0.2',
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });
  }, []);

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
    </mesh>
  );
}

export function Prize3DScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      <PresentationControls
        global
        config={{ mass: 2, tension: 500 }}
        snap={{ mass: 4, tension: 1500 }}
      >
        <Float
          speed={4}
          rotationIntensity={1}
          floatIntensity={2}
        >
          <TrophyModel 
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={0.5}
          />
        </Float>
      </PresentationControls>
    </Canvas>
  );
}