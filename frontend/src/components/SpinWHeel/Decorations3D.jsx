import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Box } from '@react-three/drei';

export function Decorations3D() {
  const floatingPrizesRef = useRef([]);

  useFrame((state) => {
    floatingPrizesRef.current.forEach((prize, i) => {
      const time = state.clock.getElapsedTime();
      prize.position.y = Math.sin(time + i) * 0.3;
      prize.rotation.y += 0.01;
    });
  });

  const prizes = [
    { position: [-4, 2, -2], color: '#FFD700', baseColor: '#B8860B', scale: 0.5 }, // Gold prize
    { position: [4, 2, -2], color: '#C0C0C0', baseColor: '#808080', scale: 0.5 },  // Silver prize
    { position: [0, 4, -3], color: '#cd7f32', baseColor: '#8B4513', scale: 0.5 },  // Bronze prize
  ];

  return (
    <>
      {/* Add Lights to the Scene */}
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={2} castShadow />

      <group>
        {prizes.map((prize, index) => (
          <group
            key={index}
            position={prize.position}
            ref={(el) => (floatingPrizesRef.current[index] = el)}
          >
            {/* Floating Sphere */}
            <Sphere scale={prize.scale} castShadow receiveShadow>
              <meshStandardMaterial
                color={prize.color}
                metalness={0.5}
                roughness={0.3}
              />
            </Sphere>

            {/* Base Box with Different Color */}
            <Box
              position={[0, -0.3, 0]}
              scale={[0.2, 0.6, 0.2]}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial
                color={prize.baseColor}
                metalness={0.3}  // Reduced metalness
                roughness={0.6}  // Increased roughness
              />
            </Box>
          </group>
        ))}
      </group>
    </>
  );
}
