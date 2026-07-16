'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function IFBlocks() {
  return (
    <group rotation={[0.3, 0.6, 0]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.8, 2.4, 0.8]} />
        <meshStandardMaterial color="#3498DB" roughness={0.2} metalness={0.3} />
      </mesh>

      <mesh position={[0.9, 0.8, 0]}>
        <boxGeometry args={[1.2, 0.5, 0.8]} />
        <meshStandardMaterial color="#34C759" roughness={0.2} metalness={0.3} />
      </mesh>

      <mesh position={[0.7, 0, 0]}>
        <boxGeometry args={[0.8, 0.5, 0.8]} />
        <meshStandardMaterial color="#34C759" roughness={0.2} metalness={0.3} />
      </mesh>

      <mesh position={[-0.1, -1.4, -0.1]}>
        <boxGeometry args={[1, 0.5, 1]} />
        <meshStandardMaterial color="#2B2D42" roughness={0.3} metalness={0.2} />
      </mesh>
    </group>
  )
}

export default function Logo3D() {
  return (
    <div className="w-full h-[400px]">
      <Canvas camera={{ position: [3, 2, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.8} />
        <directionalLight position={[-5, 3, -5]} intensity={0.8} color="#3498DB" />
        <pointLight position={[2, -3, 3]} intensity={0.6} color="#34C759" />
        <pointLight position={[-3, 2, 2]} intensity={0.4} color="#ffffff" />
        <IFBlocks />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
      </Canvas>
    </div>
  )
}