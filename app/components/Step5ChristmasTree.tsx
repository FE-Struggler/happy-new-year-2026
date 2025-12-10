'use client'

import React, { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  OrbitControls,
  Sparkles as ThreeSparkles,
  Float,
  Stars,
  MeshReflectorMaterial,
  SpotLight,
} from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useStore } from '../store/useStore'

// --- Utility Components ---

// 装饰彩球
const Ornaments = ({
  count,
  radius,
  isLit,
}: {
  count: number
  radius: number
  isLit: boolean
}) => {
  const ornaments = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5
      // 稍微随机化半径和高度，让分布更自然
      const r = radius * (0.85 + Math.random() * 0.15)
      const x = Math.sin(angle) * r
      const z = Math.cos(angle) * r
      const y = (Math.random() - 0.5) * 0.5 // 在层高范围内随机
      const scale = 0.1 + Math.random() * 0.08
      const color =
        Math.random() > 0.6
          ? '#ff0000'
          : Math.random() > 0.5
          ? '#ffd700'
          : '#c0c0c0'
      temp.push({
        position: [x, y, z] as [number, number, number],
        scale,
        color,
      })
    }
    return temp
  }, [count, radius])

  return (
    <group>
      {ornaments.map((o, i) => (
        <mesh key={i} position={o.position} castShadow>
          <sphereGeometry args={[o.scale, 16, 16]} />
          <meshStandardMaterial
            color={o.color}
            emissive={isLit ? o.color : '#000000'}
            emissiveIntensity={isLit ? 2 : 0}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
      ))}
    </group>
  )
}

// 复杂的树层
const AdvancedTreeLayer = ({
  position,
  scale,
  isLit,
  onClick,
  ornamentCount = 6,
}: any) => {
  const group = useRef<THREE.Group>(null)

  // 动画：点亮时轻微跳动
  useFrame(state => {
    if (!group.current) return
    if (isLit) {
      // 呼吸灯效果
      const t = state.clock.elapsedTime
      const scaleBase = 1
      const scaleVar = Math.sin(t * 2) * 0.02
      // 只有被点亮才呼吸
      group.current.scale.set(
        scale[0] * (scaleBase + scaleVar),
        scale[1] * (scaleBase + scaleVar * 0.5),
        scale[2] * (scaleBase + scaleVar)
      )
    }
  })

  return (
    <group
      ref={group}
      position={position}
      scale={scale}
      onClick={e => {
        e.stopPropagation()
        onClick()
      }}
    >
      {/* 主圆锥 */}
      <mesh castShadow receiveShadow>
        <coneGeometry args={[1, 2, 8]} />
        <meshStandardMaterial
          color={isLit ? '#2dc937' : '#2E8B57'} // Unlit: Dark Green -> SeaGreen
          emissive={isLit ? '#0f3a15' : '#001100'}
          emissiveIntensity={isLit ? 0.4 : 0.1}
          roughness={0.4}
          metalness={0.1}
          flatShading
        />
      </mesh>

      {/* 增加细节的内层圆锥，稍微旋转，增加层次感 */}
      <mesh rotation={[0, 0.5, 0]} scale={[0.9, 0.98, 0.9]} castShadow>
        <coneGeometry args={[1, 2, 8]} />
        <meshStandardMaterial
          color={isLit ? '#3ddb4a' : '#3CB371'} // Unlit: Darker -> MediumSeaGreen
          roughness={0.6}
          metalness={0.1}
          flatShading
        />
      </mesh>

      {/* 装饰品 */}
      <Ornaments count={ornamentCount} radius={0.8} isLit={isLit} />

      {isLit && (
        <pointLight distance={5} intensity={1} color="#2dc937" decay={2} />
      )}
    </group>
  )
}

const Star = ({ isLit, onClick }: any) => {
  const mesh = useRef<THREE.Mesh>(null)
  useFrame(state => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.02
      if (isLit) {
        mesh.current.rotation.z = Math.sin(state.clock.elapsedTime * 3) * 0.1
        const scale = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.1
        mesh.current.scale.set(scale, scale, scale)
      }
    }
  })

  return (
    <group
      position={[0, 3.8, 0]}
      onClick={e => {
        e.stopPropagation()
        onClick()
      }}
    >
      <mesh ref={mesh} castShadow>
        <octahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial
          color={isLit ? '#ffd700' : '#887000'}
          emissive={isLit ? '#ffd700' : '#000000'}
          emissiveIntensity={isLit ? 4 : 0}
          metalness={1}
          roughness={0}
        />
      </mesh>
      {isLit && (
        <>
          <pointLight distance={8} intensity={5} color="#ffd700" />
          <Float speed={5} rotationIntensity={1} floatIntensity={0}>
            <ThreeSparkles
              count={20}
              scale={3}
              size={4}
              speed={0.4}
              opacity={1}
              color="#ffff00"
            />
          </Float>
        </>
      )}
    </group>
  )
}

const Gifts = ({ isLit, onClick }: any) => {
  return (
    <group
      position={[0, -1.8, 0]}
      onClick={e => {
        e.stopPropagation()
        onClick()
      }}
    >
      {/* Gift 1 */}
      <mesh position={[1.2, 0.4, 1.2]} rotation={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial
          color={isLit ? '#ff0000' : '#550000'}
          emissive={isLit ? '#ff0000' : '#000'}
          emissiveIntensity={isLit ? 0.5 : 0}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[1.2, 0.4, 1.2]} rotation={[0, 0.5, 0]}>
        <boxGeometry args={[0.82, 0.82, 0.1]} />
        <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Gift 2 */}
      <mesh position={[-1.2, 0.3, 0.5]} rotation={[0, -0.2, 0]} castShadow>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial
          color={isLit ? '#0000ff' : '#000055'}
          emissive={isLit ? '#0000ff' : '#000'}
          emissiveIntensity={isLit ? 0.5 : 0}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[-1.2, 0.3, 0.5]} rotation={[0, -0.2, 0]}>
        <boxGeometry args={[0.1, 0.62, 0.62]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Gift 3 */}
      <mesh position={[0.2, 0.25, 1.8]} rotation={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial
          color={isLit ? '#ff00ff' : '#550055'}
          emissive={isLit ? '#ff00ff' : '#000'}
          emissiveIntensity={isLit ? 0.5 : 0}
          roughness={0.3}
        />
      </mesh>
    </group>
  )
}

const MagicParticles = () => {
  const group = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.y = clock.getElapsedTime() * 0.05
    }
  })
  return (
    <group ref={group}>
      {/* 金色粒子 - 内层 */}
      <ThreeSparkles
        count={150}
        scale={[4, 8, 4]}
        size={3}
        speed={0.4}
        opacity={0.8}
        color="#ffd700"
        noise={0.2}
      />
      {/* 金色粒子 - 外层 */}
      <ThreeSparkles
        count={100}
        scale={[8, 10, 8]}
        size={5}
        speed={0.2}
        opacity={0.5}
        color="#ffa500"
        noise={0.5}
      />
    </group>
  )
}

// 金色螺旋光效
const GoldenSpiral = () => {
  const count = 100
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const t = i / count
      const angle = t * Math.PI * 10 // 5 circles
      const radius = 2.5 * (1 - t * 0.6) + 0.5 // tapering to top
      const y = t * 7 - 3 // height from -3 to 4

      pos[i * 3] = Math.cos(angle) * radius
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = Math.sin(angle) * radius
    }
    return pos
  }, [])

  const pointsRef = useRef<THREE.Points>(null)

  useFrame(state => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.2
      pointsRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#ffd700"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

const Reindeer = () => {
  const group = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (group.current) {
      const t = clock.getElapsedTime() * 0.5
      // Orbit around the tree
      group.current.position.x = Math.sin(t) * 5
      group.current.position.z = Math.cos(t) * 5
      group.current.rotation.y = t + Math.PI / 2
      // Bounce
      group.current.position.y = Math.sin(t * 10) * 0.1 - 1.8
    }
  })

  return (
    <group ref={group}>
      {/* Body */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.5, 0.4, 0.8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.9, 0.5]} castShadow>
        <boxGeometry args={[0.3, 0.3, 0.4]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {/* Antlers */}
      <mesh position={[0.15, 1.2, 0.5]} rotation={[0, 0, 0.5]}>
        {' '}
        <cylinderGeometry args={[0.02, 0.02, 0.4]} />{' '}
        <meshStandardMaterial color="#d2b48c" />{' '}
      </mesh>
      <mesh position={[-0.15, 1.2, 0.5]} rotation={[0, 0, -0.5]}>
        {' '}
        <cylinderGeometry args={[0.02, 0.02, 0.4]} />{' '}
        <meshStandardMaterial color="#d2b48c" />{' '}
      </mesh>

      {/* Nose */}
      <mesh position={[0, 0.9, 0.75]}>
        <sphereGeometry args={[0.08]} />
        <meshStandardMaterial
          color="red"
          emissive="red"
          emissiveIntensity={0.8}
        />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.15, 0.1, 0.3]}>
        {' '}
        <boxGeometry args={[0.1, 0.4, 0.1]} />{' '}
        <meshStandardMaterial color="#5C3317" />{' '}
      </mesh>
      <mesh position={[0.15, 0.1, 0.3]}>
        {' '}
        <boxGeometry args={[0.1, 0.4, 0.1]} />{' '}
        <meshStandardMaterial color="#5C3317" />{' '}
      </mesh>
      <mesh position={[-0.15, 0.1, -0.3]}>
        {' '}
        <boxGeometry args={[0.1, 0.4, 0.1]} />{' '}
        <meshStandardMaterial color="#5C3317" />{' '}
      </mesh>
      <mesh position={[0.15, 0.1, -0.3]}>
        {' '}
        <boxGeometry args={[0.1, 0.4, 0.1]} />{' '}
        <meshStandardMaterial color="#5C3317" />{' '}
      </mesh>
    </group>
  )
}

const SnowFloor = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
      <circleGeometry args={[20, 32]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={40}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#313131"
        metalness={0.1}
        mirror={0}
      />
    </mesh>
  )
}

export const Step5ChristmasTree = () => {
  const [litState, setLitState] = useState({
    star: false,
    top: false,
    mid: false,
    bottom: false,
    gifts: false,
  })
  const [isFullyLit, setIsFullyLit] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const { userName } = useStore()

  const handleLightUp = (part: keyof typeof litState) => {
    if (litState[part]) return // 已经点亮就不重复触发

    const newState = { ...litState, [part]: true }
    setLitState(newState)

    // Check if all lit
    if (Object.values(newState).every(v => v)) {
      setIsFullyLit(true)
      setShowModal(true)
      triggerFinalCelebration()
    } else {
      // 小庆祝
      confetti({
        particleCount: 30,
        spread: 40,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500'],
      })
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
        colors: ['#ff0000', '#00ff00', '#ffffff', '#ffd700'],
      })
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff0000', '#00ff00', '#ffffff', '#ffd700'],
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()
  }

  // 组件挂载时触发resize事件，确保Canvas正确计算尺寸
  useEffect(() => {
    const triggerResize = () => {
      window.dispatchEvent(new Event('resize'))
    }

    // 立即触发一次
    triggerResize()

    // 延迟触发，确保DOM完全渲染
    const timer1 = setTimeout(triggerResize, 100)
    const timer2 = setTimeout(triggerResize, 300)
    const timer3 = setTimeout(triggerResize, 1000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  return (
    <div
      className="relative w-full h-full bg-linear-to-b from-[#1a2a6c] via-[#b21f1f] to-[#fdbb2d]"
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        minHeight: '100dvh', // 移动端动态视口高度
      }}
    >
      <div className="absolute top-10 w-full text-center z-10 pointer-events-none">
        <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-green-300 via-yellow-200 to-red-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] animate-pulse">
          第五步：点亮圣诞树
        </h2>
        <p className="text-white mt-2 text-lg drop-shadow-md font-semibold">
          点击星星、树层和礼物，唤醒新年的魔法
        </p>
      </div>

      <Canvas
        shadows
        camera={{ position: [0, 0.3, 14], fov: 45 }}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
        gl={{ antialias: true, alpha: false }}
      >
        {/* 环境设置 */}
        <fog attach="fog" args={['#2a5298', 10, 50]} />
        <ambientLight intensity={1.5} color="#ffffff" />
        <hemisphereLight args={['#87CEEB', '#4B0082', 1.5]} />
        <SpotLight
          position={[10, 20, 10]}
          angle={0.3}
          penumbra={1}
          intensity={4}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-10, 5, -10]} intensity={1} color="#ffaa00" />

        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />

        <group position={[0, -0.5, 0]}>
          {/* Trunk */}
          <mesh position={[0, -1, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.3, 0.5, 2]} />
            <meshStandardMaterial color="#5C4033" roughness={0.8} />
          </mesh>

          {/* Tree Layers - 从下往上 */}
          <AdvancedTreeLayer
            position={[0, -0.5, 0]}
            scale={[1.6, 1.2, 1.6]}
            isLit={litState.bottom}
            onClick={() => handleLightUp('bottom')}
            ornamentCount={12}
          />
          <AdvancedTreeLayer
            position={[0, 0.9, 0]}
            scale={[1.3, 1.1, 1.3]}
            isLit={litState.mid}
            onClick={() => handleLightUp('mid')}
            ornamentCount={10}
          />
          <AdvancedTreeLayer
            position={[0, 2.2, 0]}
            scale={[0.9, 1, 0.9]}
            isLit={litState.top}
            onClick={() => handleLightUp('top')}
            ornamentCount={8}
          />

          {/* Star */}
          <Star isLit={litState.star} onClick={() => handleLightUp('star')} />

          {/* Gifts */}
          <Gifts
            isLit={litState.gifts}
            onClick={() => handleLightUp('gifts')}
          />

          {/* Reindeer */}
          {isFullyLit && <Reindeer />}

          {/* Environment Effects */}
          <SnowFloor />
          <MagicParticles />
          <GoldenSpiral />
          <ThreeSparkles
            count={300}
            scale={[20, 20, 20]}
            size={1.2}
            speed={0.2}
            opacity={0.6}
            color="#fff"
          />
        </group>

        {/* Post Processing for Glow Effect */}
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.5} // 阈值，只有亮度超过这个值的像素才会发光
            mipmapBlur // 更好的模糊质量
            intensity={1.5} // 发光强度
            radius={0.6} // 光晕半径
          />
        </EffectComposer>

        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2 - 0.1}
          minPolarAngle={Math.PI / 3}
          maxAzimuthAngle={Math.PI / 4}
          minAzimuthAngle={-Math.PI / 4}
          target={[0, 0.3, 0]} // 确保视角中心对准树的中心
        />
      </Canvas>

      {showModal && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
        >
          <div className="bg-black/60 backdrop-blur-md p-12 rounded-4xl border border-white/10 text-center shadow-2xl relative pointer-events-auto max-w-2xl mx-4">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 drop-shadow-[0_0_25px_rgba(255,215,0,0.6)] leading-tight">
              {userName ? `${userName}` : ''} <br /> 新年快乐！
            </h1>
            <div className="text-xl md:text-2xl text-gray-100 font-light tracking-wide mb-10 leading-loose">
              <p>2026，愿你眼中有光，心中有爱。</p>
              <p>所有的小失落都是惊喜的铺垫，</p>
              <p>所有的坚持终将迎来花开。</p>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                className="px-10 py-4 bg-linear-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white rounded-full font-bold pointer-events-auto transition-all transform hover:scale-105 shadow-lg text-xl"
                onClick={() => setShowModal(false)}
              >
                开启新年好运！
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
