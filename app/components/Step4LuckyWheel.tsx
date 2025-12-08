'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { useStore } from '../store/useStore'
import confetti from 'canvas-confetti'
import { ArrowDown } from 'lucide-react'

const DEFAULT_PRIZES = [
  { label: '锦鲤附体', color: '#ff4d4d', text: '运气爆棚，万事顺遂！' },
  { label: '身体健康', color: '#2ed573', text: '吃嘛嘛香，百毒不侵！' },
  { label: '桃花朵朵', color: '#ff78c4', text: '人见人爱，花见花开！' },
  { label: '学业亨通', color: '#1e90ff', text: '逢考必过，智慧过人！' },
  { label: '志在必得', color: '#a55eea', text: '心想事成，梦想成真！' },
]

const COLORS = ['#ff4d4d', '#2ed573', '#ff78c4', '#1e90ff', '#a55eea', '#ffa502', '#ff6b81', '#7bed9f']

export const Step4LuckyWheel = () => {
  const { setStep, unlockStep, wishes } = useStore()
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState<{ label: string; color: string; text: string } | null>(null)
  const controls = useAnimation()
  const [rotation, setRotation] = useState(0)

  const prizes = useMemo(() => {
      // Integrate wishes into prizes
      // If we have wishes, mix them in or append them
      if (!wishes || wishes.length === 0) return DEFAULT_PRIZES

      const wishPrizes = wishes.map((wish, index) => ({
          label: wish.length > 4 ? wish.substring(0, 4) + '...' : wish,
          color: COLORS[(DEFAULT_PRIZES.length + index) % COLORS.length],
          text: `愿望实现：${wish}`
      }))

      // Combine default and wish prizes, maybe shuffle or just append
      // To keep the wheel balanced, let's just append
      return [...DEFAULT_PRIZES, ...wishPrizes]
  }, [wishes])

  const spinWheel = async () => {
    if (isSpinning) return

    setIsSpinning(true)
    setResult(null)

    // Calculate random rotation
    // Minimum 5 full spins (1800 deg) + random segment
    const segmentAngle = 360 / prizes.length
    const randomOffset = Math.random() * 360
    const targetRotation = rotation + 1800 + randomOffset
    
    // Animate
    await controls.start({
      rotate: targetRotation,
      transition: { duration: 4, ease: [0.2, 0.8, 0.2, 1] } // Custom bezier for spin-up and slow-down
    })

    setRotation(targetRotation)
    
    // Calculate result
    // Normalized rotation to 0-360
    // The arrow is at the top. We need to find which segment is at 0 degrees (top).
    // The wheel rotates CLOCKWISE.
    // The segment at the top is determined by the final rotation modulo 360.
    // However, the wheel starts with index 0 at 0 degrees (right?) or top?
    // In our SVG: 
    // Segment i spans from (i * angle) to ((i+1) * angle).
    // We rotate the entire container.
    // If rotation is 0, segment 0 is at [0, angle].
    // If we rotate -90 deg (container start), segment 0 starts at top-right?
    // Let's stick to the visual logic:
    // degrees = (360 - (targetRotation % 360)) % 360
    // This gives the angle "under" the top pointer if the pointer is at 0 degrees relative to the wheel's initial state.
    
    // Our SVG starts drawing from 0 radians (3 o'clock) if we don't rotate it.
    // But we rotated the SVG container -90deg in CSS? No, we rotated the SVG content -90deg inside the container?
    // Wait, let's look at the code: <svg ... className="... transform -rotate-90">
    // So 0 index starts at 12 o'clock (Top).
    // Segment 0: [0, angle] (Clockwise from Top)
    // Segment 1: [angle, 2*angle]
    // ...
    // If we rotate the container by R degrees. The pointer stays at Top (0 deg).
    // Effectively, the pointer moves -R degrees relative to the wheel.
    // So pointer angle on wheel = (0 - R) = -R.
    // Normalize to [0, 360): (360 - (R % 360)) % 360.
    
    const degrees = (360 - (targetRotation % 360)) % 360
    const index = Math.floor(degrees / segmentAngle)
    const wonPrize = prizes[index] || prizes[0] // Fallback just in case
    
    setResult(wonPrize)
    triggerFireworks()
    
    setTimeout(() => {
        unlockStep(5)
    }, 1000)
    setIsSpinning(false)
  }

  const triggerFireworks = () => {
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 }

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      // since particles fall down, start a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } })
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } })
    }, 250)
  }

  const handleNext = () => {
    setStep(5)
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8 overflow-hidden">
      <div className="text-center z-10 mb-8">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-red-600 to-orange-500 drop-shadow-sm">
          第四步：幸运转盘
        </h2>
        <p className="text-orange-700/80 mt-2">点击转盘，抽取你的2026年度关键词</p>
      </div>

      <div className="relative group">
        {/* Pointer */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20 text-yellow-400 drop-shadow-lg">
          <ArrowDown size={48} fill="currentColor" />
        </div>

        {/* Wheel Container */}
        <motion.div
            className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full border-8 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.5)] relative overflow-hidden bg-white"
            animate={controls}
            style={{ rotate: rotation }}
        >
            {/* SVG implementation for perfect slices */}
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90"> {/* Rotate -90 so first slice starts at top right, aligning with 0deg logic better or tweak */}
                {prizes.map((prize, i) => {
                    const angle = 360 / prizes.length
                    // Calculate path for slice
                    // x = r + r * cos(a)
                    // y = r + r * sin(a)
                    // We need a path from center (50,50) to arc.
                    // It's easier to just use circle strokes or simple colored paths
                    const startAngle = (i * angle) * Math.PI / 180
                    const endAngle = ((i + 1) * angle) * Math.PI / 180
                    const x1 = 50 + 50 * Math.cos(startAngle)
                    const y1 = 50 + 50 * Math.sin(startAngle)
                    const x2 = 50 + 50 * Math.cos(endAngle)
                    const y2 = 50 + 50 * Math.sin(endAngle)
                    
                    // Large arc flag: if angle > 180, use 1. But here angle is usually < 180 (unless < 2 items)
                    const largeArcFlag = angle > 180 ? 1 : 0
                    
                    return (
                        <path
                            key={i}
                            d={`M50,50 L${x1},${y1} A50,50 0 ${largeArcFlag},1 ${x2},${y2} Z`}
                            fill={prize.color}
                            stroke="white"
                            strokeWidth="0.5"
                        />
                    )
                })}
            </svg>
            
            {/* Text Overlay */}
            {prizes.map((prize, i) => {
                const angle = 360 / prizes.length
                const rotation = i * angle + angle / 2 // Center of slice
                return (
                    <div
                        key={i}
                        className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none"
                        style={{ transform: `rotate(${rotation}deg)` }}
                    >
                        <span className="absolute top-[12%] left-1/2 -translate-x-1/2 text-white font-bold text-lg md:text-xl writing-vertical-rl select-none" style={{ writingMode: 'vertical-rl' }}>
                            {prize.label}
                        </span>
                    </div>
                )
            })}
        </motion.div>

        {/* Center Button */}
        <button
            onClick={spinWheel}
            disabled={isSpinning}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-lg border-4 border-yellow-500 flex items-center justify-center font-bold text-red-500 hover:scale-110 transition-transform z-30 disabled:opacity-80 disabled:hover:scale-100 cursor-pointer"
        >
            {isSpinning ? '...' : 'GO'}
        </button>
      </div>

      {/* Result Modal */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-8 bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/40 text-center max-w-sm shadow-xl z-50"
          >
            <h3 className="text-3xl font-bold mb-2" style={{ color: result.color }}>{result.label}</h3>
            <p className="text-slate-700 text-lg">{result.text}</p>
            <button
                onClick={handleNext}
                className="mt-4 px-6 py-2 bg-linear-to-r from-yellow-400 to-orange-500 rounded-full text-white font-bold shadow-lg hover:scale-105 transition-transform"
            >
                去点亮圣诞树 &rarr;
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
