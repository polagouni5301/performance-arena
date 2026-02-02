import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';

export function WheelStand() {
  const leftPillarRef = useRef();
  const rightPillarRef = useRef();
  const basePlateRef = useRef();

  // Enhanced material properties for 3D look
  const pillarMaterial = {
    color: '#FFFFFF',
    metalness: 0.5,  // Reduced for better color visibility
  roughness: 0.2,  // Increased for more natural look
    emissive: '#111111',
    emissiveIntensity: 0.1
  };

  const baseMaterial = {
    color: '#000000',
    metalness: 0.95,
    roughness: 0.05,
    emissive: '#FFFFFF',
    emissiveIntensity: 0.05
  };

  return (
    <group position={[0, -2, 0]}>
      {/* Left Pillar with enhanced 3D properties */}
      <Box
        ref={leftPillarRef}
        position={[-2.5, 1, 0]}
        scale={[0.2, 4, 0.2]}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          {...pillarMaterial}
          clearcoat={1}
          clearcoatRoughness={0.1}
          reflectivity={1}
          envMapIntensity={1}
        />
      </Box>

      {/* Right Pillar with enhanced 3D properties */}
      <Box
        ref={rightPillarRef}
        position={[2.5, 1, 0]}
        scale={[0.2, 4, 0.2]}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          {...pillarMaterial}
          clearcoat={1}
          clearcoatRoughness={0.1}
          reflectivity={1}
          envMapIntensity={1}
        />
      </Box>

      {/* Base Plate with enhanced 3D properties */}
      <Box
        ref={basePlateRef}
        position={[0, -1, 0]}
        scale={[6, 0.2, 2]}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          {...baseMaterial}
          clearcoat={1}
          clearcoatRoughness={0.1}
          reflectivity={1}
          envMapIntensity={1}
        />
      </Box>

      {/* Additional decorative elements for enhanced 3D effect */}
      <Box
        position={[-2.5, -0.9, 0]}
        scale={[0.4, 0.1, 0.4]}
        castShadow
      >
        <meshPhysicalMaterial
          color="#FFFFFF" 
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
        />
      </Box>
      
      <Box
        position={[2.5, -0.9, 0]}
        scale={[0.4, 0.1, 0.4]}
        castShadow
      >
        <meshPhysicalMaterial
          color="#FFFFFF"
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
        />
        
      </Box>

     
    </group>
  );
}