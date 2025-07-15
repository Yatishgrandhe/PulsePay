import { Canvas } from '@react-three/fiber';
import { Float, OrbitControls, Html } from '@react-three/drei';
import type { ComponentProps } from 'react';

function HeartModel(props: ComponentProps<'mesh'>) {
  // Simple heart shape using TorusKnot as a placeholder for a 3D heart
  return (
    <mesh {...props} scale={1.5}>
      <torusKnotGeometry args={[1, 0.35, 100, 16]} />
      <meshStandardMaterial color="#E573B7" emissive="#FFD166" emissiveIntensity={0.2} />
    </mesh>
  );
}

export default function Pulse3DHero() {
  return (
    <div className="w-full h-64 md:h-80 rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-pulsepay-pink via-pulsepay-purple to-pulsepay-gold mb-6">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={0.7} />
        <Float speed={2} rotationIntensity={1.2} floatIntensity={1.5}>
          <HeartModel />
        </Float>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.2} />
        <Html position={[0, -2.2, 0]} center>
          <div className="text-white font-heading font-bold text-lg drop-shadow-lg">PulsePay 3D</div>
        </Html>
      </Canvas>
    </div>
  );
} 