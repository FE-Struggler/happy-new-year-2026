'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, OrbitControls, Sparkles as ThreeSparkles, Float, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../store/useStore'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'

const TreeLayer = ({ position, scale, isLit, onClick }: any) => {
  return (
    <group position={position} scale={scale} onClick={(e) => { e.stopPropagation(); onClick() }}>
      <mesh>
        <coneGeometry args={[1, 2, 8]} />
        <meshStandardMaterial
          color={isLit ? '#2dc937' : '#1a472a'}
          emissive={isLit ? '#2dc937' : '#000000'}
          emissiveIntensity={isLit ? 0.8 : 0}
          roughness={0.4}
        />
      </mesh>
      {isLit && (
         <pointLight distance={3} intensity={2} color="#2dc937" />
      )}
    </group>
  )
}

const Star = ({ isLit, onClick }: any) => {
  const mesh = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (mesh.current) {
        mesh.current.rotation.y += 0.02
        if (isLit) {
            mesh.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1
        }
    }
  })

  return (
    <group position={[0, 3.5, 0]} onClick={(e) => { e.stopPropagation(); onClick() }}>
      <mesh ref={mesh}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color={isLit ? '#ffd700' : '#887000'}
          emissive={isLit ? '#ffd700' : '#000000'}
          emissiveIntensity={isLit ? 1.5 : 0}
        />
      </mesh>
      {isLit && <pointLight distance={5} intensity={3} color="#ffd700" />}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <ThreeSparkles count={10} scale={2} size={2} speed={0.4} opacity={isLit ? 1 : 0} color="#ffff00" />
      </Float>
    </group>
  )
}

const Gifts = ({ isLit, onClick }: any) => {
  return (
    <group position={[0, -2, 0]} onClick={(e) => { e.stopPropagation(); onClick() }}>
      {/* Gift 1 */}
      <mesh position={[1, 0, 1]} rotation={[0, 0.5, 0]}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color={isLit ? '#ff0000' : '#550000'} emissive={isLit ? '#ff0000' : '#000000'} emissiveIntensity={isLit ? 0.5 : 0} />
      </mesh>
      {/* Gift 2 */}
      <mesh position={[-1, 0, 0.5]} rotation={[0, -0.2, 0]}>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial color={isLit ? '#0000ff' : '#000055'} emissive={isLit ? '#0000ff' : '#000000'} emissiveIntensity={isLit ? 0.5 : 0} />
      </mesh>
       {/* Gift 3 */}
       <mesh position={[0, 0, 1.5]} rotation={[0, 0.2, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={isLit ? '#ff00ff' : '#550055'} emissive={isLit ? '#ff00ff' : '#000000'} emissiveIntensity={isLit ? 0.5 : 0} />
      </mesh>
    </group>
  )
}

const Reindeer = () => {
  const group = useRef<THREE.Group>(null)
  
  useFrame(({ clock }) => {
    if (group.current) {
        const t = clock.getElapsedTime() * 0.5
        // Orbit around the tree
        group.current.position.x = Math.sin(t) * 4
        group.current.position.z = Math.cos(t) * 4
        group.current.rotation.y = t + Math.PI / 2
        // Bounce
        group.current.position.y = Math.sin(t * 10) * 0.1 - 2
    }
  })

  return (
    <group ref={group}>
        {/* Body */}
        <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[0.5, 0.4, 0.8]} />
            <meshStandardMaterial color="#8B4513" />
        </mesh>
        {/* Head */}
        <mesh position={[0, 0.9, 0.5]}>
            <boxGeometry args={[0.3, 0.3, 0.4]} />
            <meshStandardMaterial color="#8B4513" />
        </mesh>
        {/* Nose */}
        <mesh position={[0, 0.9, 0.75]}>
            <sphereGeometry args={[0.08]} />
            <meshStandardMaterial color="red" emissive="red" emissiveIntensity={0.5} />
        </mesh>
        {/* Legs */}
        <mesh position={[-0.15, 0.1, 0.3]}> <boxGeometry args={[0.1, 0.4, 0.1]} /> <meshStandardMaterial color="#5C3317" /> </mesh>
        <mesh position={[0.15, 0.1, 0.3]}> <boxGeometry args={[0.1, 0.4, 0.1]} /> <meshStandardMaterial color="#5C3317" /> </mesh>
        <mesh position={[-0.15, 0.1, -0.3]}> <boxGeometry args={[0.1, 0.4, 0.1]} /> <meshStandardMaterial color="#5C3317" /> </mesh>
        <mesh position={[0.15, 0.1, -0.3]}> <boxGeometry args={[0.1, 0.4, 0.1]} /> <meshStandardMaterial color="#5C3317" /> </mesh>
    </group>
  )
}

export const Step5ChristmasTree = () => {
  const [litState, setLitState] = useState({ star: false, top: false, mid: false, bottom: false, gifts: false })
  const [isFullyLit, setIsFullyLit] = useState(false)

  const handleLightUp = (part: keyof typeof litState) => {
    const newState = { ...litState, [part]: true }
    setLitState(newState)
    
    // Check if all lit
    if (Object.values(newState).every(v => v)) {
        setIsFullyLit(true)
        triggerFinalCelebration()
    }
  }

  const triggerFinalCelebration = () => {
    const duration = 5000
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff0000', '#00ff00', '#ffffff']
      })
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff0000', '#00ff00', '#ffffff']
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()
  }

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-10 w-full text-center z-10 pointer-events-none">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-green-600 to-red-500 drop-shadow-sm">
          第五步：点亮圣诞树
        </h2>
        <p className="text-green-800/80 mt-2">点击树的星星、礼物和不同层级，点亮你的2026</p>
      </div>

      <Canvas shadows camera={{ position: [0, 2, 8], fov: 50 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <group position={[0, -1, 0]}>
            {/* Trunk */}
            <mesh position={[0, -1, 0]}>
                <cylinderGeometry args={[0.4, 0.5, 2]} />
                <meshStandardMaterial color="#5C3317" />
            </mesh>

            {/* Tree Layers */}
            <TreeLayer position={[0, -0.5, 0]} scale={[1.5, 1, 1.5]} isLit={litState.bottom} onClick={() => handleLightUp('bottom')} />
            <TreeLayer position={[0, 0.8, 0]} scale={[1.2, 1, 1.2]} isLit={litState.mid} onClick={() => handleLightUp('mid')} />
            <TreeLayer position={[0, 2, 0]} scale={[0.8, 1, 0.8]} isLit={litState.top} onClick={() => handleLightUp('top')} />

            {/* Star */}
            <Star isLit={litState.star} onClick={() => handleLightUp('star')} />

            {/* Gifts */}
            <Gifts isLit={litState.gifts} onClick={() => handleLightUp('gifts')} />

            {/* Reindeer (Appears when fully lit or always there roaming) */}
            {isFullyLit && <Reindeer />}
            
            {/* Snow */}
            <ThreeSparkles count={200} scale={10} size={1} speed={0.2} opacity={0.5} color="#fff" position={[0, 2, 0]} />
        </group>

        <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2 + 0.2} minPolarAngle={Math.PI / 3} />
      </Canvas>
      
      {isFullyLit && (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
        >
            <div className="bg-black/50 backdrop-blur-sm p-10 rounded-3xl border border-white/20 text-center">
                <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">
                    Happy New Year 2026!
                </h1>
                <p className="text-2xl text-gray-200">
                    愿你新的一年，万事胜意，平安喜乐！
                </p>
                <button 
                    className="mt-8 px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold pointer-events-auto transition-colors shadow-lg"
                    onClick={() => window.location.reload()}
                >
                    再玩一次
                </button>
            </div>
        </motion.div>
      )}
    </div>
  )
}
