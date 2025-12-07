'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation } from 'framer-motion'
import { useStore } from '../store/useStore'
import confetti from 'canvas-confetti'

// --- 卡通元素组件 ---

const BadCloud = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
    <path d="M25,60 Q10,60 10,45 Q10,30 25,30 Q30,10 50,10 Q70,10 75,30 Q90,30 90,45 Q90,60 75,60 L25,60 Z" fill="#4B5563" stroke="#1F2937" strokeWidth="3" />
    <path d="M35,40 L45,50 M45,40 L35,50" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
    <path d="M55,40 L65,50 M65,40 L55,50" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
    <path d="M40,55 Q50,50 60,55" stroke="#CBD5E1" strokeWidth="3" fill="none" />
    <path d="M65,20 L60,30 L68,30 L63,40" stroke="#FCD34D" strokeWidth="2" fill="none" />
  </svg>
)

const StressMonster = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
    <circle cx="50" cy="50" r="40" fill="#7C3AED" stroke="#5B21B6" strokeWidth="3" />
    <path d="M50,10 L45,20 L55,20 Z" fill="#5B21B6" />
    <path d="M90,50 L80,45 L80,55 Z" fill="#5B21B6" />
    <path d="M50,90 L45,80 L55,80 Z" fill="#5B21B6" />
    <path d="M10,50 L20,45 L20,55 Z" fill="#5B21B6" />
    <circle cx="35" cy="45" r="8" fill="white" />
    <circle cx="35" cy="45" r="3" fill="black" />
    <circle cx="65" cy="45" r="10" fill="white" />
    <circle cx="65" cy="45" r="2" fill="black" />
    <path d="M35,65 Q50,75 65,65" stroke="black" strokeWidth="3" fill="none" />
    <path d="M35,65 L37,70 M45,67 L47,72 M55,68 L57,73 M65,65 L63,70" stroke="black" strokeWidth="1" />
  </svg>
)

const PoorBag = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
    <path d="M20,80 Q20,95 50,95 Q80,95 80,80 L70,30 Q70,20 50,20 Q30,20 30,30 Z" fill="#92400E" stroke="#78350F" strokeWidth="3" />
    <path d="M30,30 L70,30" stroke="#FCD34D" strokeWidth="4" strokeDasharray="5,2" />
    <rect x="30" y="60" width="20" height="20" rx="2" fill="#B45309" stroke="#78350F" strokeWidth="2" transform="rotate(-10 40 70)" />
    <path d="M32,62 L34,64 M38,62 L40,64" stroke="#78350F" strokeWidth="1" />
    <circle cx="45" cy="45" r="2" fill="#1F2937" />
    <circle cx="60" cy="45" r="2" fill="#1F2937" />
    <path d="M52,55 Q52,60 52,55" stroke="#1F2937" strokeWidth="2" />
    <path d="M48,52 Q52,48 56,52" stroke="#1F2937" strokeWidth="1" fill="none" />
  </svg>
)

const OverworkGhost = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
    <path d="M20,80 Q20,10 50,10 Q80,10 80,80 L70,90 L60,80 L50,90 L40,80 L30,90 Z" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="3" />
    <ellipse cx="35" cy="45" rx="8" ry="6" fill="#9CA3AF" opacity="0.5" />
    <ellipse cx="65" cy="45" rx="8" ry="6" fill="#9CA3AF" opacity="0.5" />
    <circle cx="35" cy="45" r="3" fill="#374151" />
    <circle cx="65" cy="45" r="3" fill="#374151" />
    <ellipse cx="50" cy="65" rx="5" ry="8" fill="#374151" />
  </svg>
)

const RottenApple = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
    <path d="M30,35 Q20,35 20,55 Q20,85 50,90 Q80,85 80,55 Q80,35 70,35 Q60,35 50,50 Q40,35 30,35" fill="#65A30D" stroke="#365314" strokeWidth="3" />
    <path d="M50,50 L50,20" stroke="#713F12" strokeWidth="4" />
    <path d="M50,20 Q60,10 70,20" fill="none" stroke="#3F6212" strokeWidth="3" />
    <path d="M30,60 Q35,50 40,60" stroke="#FCA5A5" strokeWidth="3" fill="none" />
    <circle cx="40" cy="60" r="2" fill="#FCA5A5" />
    <path d="M55,65 L65,70 M65,65 L55,70" stroke="#1F2937" strokeWidth="2" />
    <path d="M60,60 L60,62" stroke="#1F2937" strokeWidth="2" />
  </svg>
)

const MercuryRetrograde = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
    <circle cx="50" cy="50" r="35" fill="#6D28D9" stroke="#4C1D95" strokeWidth="3" />
    <path d="M20,50 Q50,20 80,50 Q50,80 20,50 Z" fill="none" stroke="#A78BFA" strokeWidth="2" opacity="0.5" />
    <path d="M40,40 L60,60 M60,40 L40,60" stroke="#C4B5FD" strokeWidth="4" strokeLinecap="round" />
    <path d="M30,50 L25,45 M30,50 L25,55" stroke="#A78BFA" strokeWidth="2" />
  </svg>
)

const Insomnia = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
    <circle cx="35" cy="50" r="15" fill="white" stroke="#DC2626" strokeWidth="2" />
    <circle cx="65" cy="50" r="15" fill="white" stroke="#DC2626" strokeWidth="2" />
    <circle cx="35" cy="50" r="3" fill="black" />
    <circle cx="65" cy="50" r="3" fill="black" />
    <path d="M35,50 L45,40 M65,50 L75,40" stroke="#EF4444" strokeWidth="1" />
    <path d="M35,50 L25,40 M65,50 L55,40" stroke="#EF4444" strokeWidth="1" />
  </svg>
)

const HairLoss = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
    <path d="M20,60 L80,60 L80,40 L20,40 Z" fill="#FCD34D" stroke="#D97706" strokeWidth="3" />
    <path d="M25,60 L25,80 M35,60 L35,80 M45,60 L45,80 M55,60 L55,80 M65,60 L65,80 M75,60 L75,80" stroke="#D97706" strokeWidth="3" />
    <path d="M40,30 Q50,10 60,30" stroke="#1F2937" strokeWidth="2" fill="none" />
    <path d="M45,25 Q50,5 55,25" stroke="#1F2937" strokeWidth="2" fill="none" />
  </svg>
)

const WeightGain = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
    <rect x="20" y="20" width="60" height="60" rx="5" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="3" />
    <rect x="30" y="30" width="40" height="20" fill="#1F2937" />
    <text x="50" y="45" textAnchor="middle" fill="red" fontSize="12" fontFamily="monospace">999.9</text>
    <circle cx="50" cy="65" r="10" fill="none" stroke="#9CA3AF" strokeWidth="2" />
  </svg>
)

const Lag = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
    <circle cx="50" cy="50" r="30" stroke="#3B82F6" strokeWidth="6" fill="none" strokeDasharray="140" strokeDashoffset="40" strokeLinecap="round" />
    <circle cx="50" cy="50" r="30" stroke="#DBEAFE" strokeWidth="6" fill="none" opacity="0.3" />
  </svg>
)

const Anxiety = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
    <path d="M20,50 Q30,20 40,50 T60,50 T80,50" stroke="#1F2937" strokeWidth="3" fill="none" />
    <path d="M20,40 Q40,70 60,40 T90,40" stroke="#4B5563" strokeWidth="3" fill="none" />
    <path d="M10,60 Q30,30 50,60 T90,60" stroke="#374151" strokeWidth="3" fill="none" />
  </svg>
)

const SocialDeath = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
    <circle cx="50" cy="50" r="40" fill="#FDA4AF" stroke="#BE123C" strokeWidth="3" />
    <path d="M30,40 L40,40 M60,40 L70,40" stroke="#881337" strokeWidth="3" strokeLinecap="round" />
    <circle cx="35" cy="40" r="2" fill="#881337" />
    <circle cx="65" cy="40" r="2" fill="#881337" />
    <path d="M40,70 Q50,60 60,70" stroke="#881337" strokeWidth="3" fill="none" />
    <path d="M75,20 L75,35" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
    <path d="M80,25 L80,30" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
  </svg>
)

const Broke = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
    <circle cx="50" cy="50" r="35" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="3" />
    <text x="50" y="60" textAnchor="middle" fontSize="30" fill="#6B7280" fontWeight="bold">$</text>
    <path d="M30,30 L70,70" stroke="#EF4444" strokeWidth="4" />
    <path d="M70,30 L30,70" stroke="#EF4444" strokeWidth="4" />
  </svg>
)

const Sickness = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
    <circle cx="50" cy="50" r="35" fill="#86EFAC" stroke="#15803D" strokeWidth="3" />
    <circle cx="35" cy="45" r="3" fill="#14532D" />
    <circle cx="65" cy="45" r="3" fill="#14532D" />
    <path d="M40,65 Q50,60 60,65" stroke="#14532D" strokeWidth="3" fill="none" />
    <path d="M20,50 L10,50 M90,50 L80,50 M50,20 L50,10 M50,90 L50,80" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />
  </svg>
)

const Overthinking = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
    <path d="M30,40 Q30,20 50,20 Q70,20 70,40 Q70,60 50,60 Q30,60 30,40 Z" fill="#F9A8D4" stroke="#BE185D" strokeWidth="3" />
    <text x="80" y="30" fontSize="20" fill="#BE185D" fontWeight="bold">?</text>
    <text x="20" y="30" fontSize="20" fill="#BE185D" fontWeight="bold">?</text>
    <text x="50" y="80" fontSize="20" fill="#BE185D" fontWeight="bold">?</text>
  </svg>
)

interface BadItemData {
  id: number
  type: 'cloud' | 'stress' | 'bag' | 'ghost' | 'apple' | 'mercury' | 'insomnia' | 'hair' | 'weight' | 'lag' | 'anxiety' | 'social' | 'broke' | 'sick' | 'think'
  x: number
  y: number
  rotation: number
  color: string[]
}

export const Step1RemoveBadLuck = () => {
  const { setStep, unlockStep } = useStore()
  const [items, setItems] = useState<BadItemData[]>([
    { id: 1, type: 'cloud', x: 20, y: 15, rotation: -10, color: ['#4B5563', '#1F2937'] },
    { id: 2, type: 'stress', x: 60, y: 10, rotation: 15, color: ['#7C3AED', '#5B21B6'] },
    { id: 3, type: 'bag', x: 80, y: 35, rotation: -5, color: ['#92400E', '#B45309'] },
    { id: 4, type: 'ghost', x: 15, y: 45, rotation: 20, color: ['#E5E7EB', '#9CA3AF'] },
    { id: 5, type: 'apple', x: 50, y: 40, rotation: -15, color: ['#65A30D', '#3F6212'] },
    // New 10 items
    { id: 7, type: 'insomnia', x: 70, y: 20, rotation: -20, color: ['#DC2626', '#EF4444'] },
    { id: 9, type: 'weight', x: 90, y: 25, rotation: -10, color: ['#9CA3AF', '#E5E7EB'] },
    { id: 10, type: 'lag', x: 40, y: 10, rotation: 30, color: ['#3B82F6', '#2563EB'] },
    { id: 11, type: 'anxiety', x: 25, y: 55, rotation: -5, color: ['#1F2937', '#4B5563'] },
    { id: 12, type: 'social', x: 65, y: 50, rotation: 15, color: ['#BE123C', '#FDA4AF'] },
    { id: 13, type: 'broke', x: 85, y: 15, rotation: -25, color: ['#9CA3AF', '#6B7280'] },
    { id: 14, type: 'sick', x: 5, y: 20, rotation: 10, color: ['#15803D', '#86EFAC'] },
    { id: 15, type: 'think', x: 45, y: 30, rotation: -15, color: ['#BE185D', '#F9A8D4'] },
  ])
  const [shredderState, setShredderState] = useState<'idle' | 'eating'>('idle')
  const shredderRef = useRef<HTMLDivElement>(null)
  const shredderControls = useAnimation()

  const handleDragStart = () => {
    setShredderState('eating') // Mouth opens
  }

  const handleDragEnd = (id: number, info: any, itemColors: string[]) => {
    setShredderState('idle')
    const shredderRect = shredderRef.current?.getBoundingClientRect()
    if (!shredderRect) return

    const dropPoint = info.point
    
    // Check if drop point is within or near the shredder
    if (
      dropPoint.x >= shredderRect.left - 80 &&
      dropPoint.x <= shredderRect.right + 80 &&
      dropPoint.y >= shredderRect.top - 80
    ) {
      // Shredded!
      removeItem(id)
      triggerShredEffect(shredderRect.left + shredderRect.width / 2, shredderRect.top + 50, itemColors)
      shakeShredder()
    }
  }

  const shakeShredder = async () => {
    await shredderControls.start({
      x: [0, -10, 10, -10, 10, 0],
      scale: [1, 1.1, 0.9, 1.1, 1],
      transition: { duration: 0.4 }
    })
  }

  const removeItem = (id: number) => {
    setItems((prev) => {
      const remaining = prev.filter((item) => item.id !== id)
      if (remaining.length === 0) {
        setTimeout(() => {
          unlockStep(2)
          setStep(2)
        }, 1500)
      }
      return remaining
    })
  }

  const triggerShredEffect = (x: number, y: number, colors: string[]) => {
    // Top burst (chunks)
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { x: x / window.innerWidth, y: y / window.innerHeight },
      colors: colors,
      gravity: 3,
      scalar: 2, // Bigger chunks
      drift: 0,
      shapes: ['square'],
      ticks: 100
    })
    
    // Bottom spray (dust)
    confetti({
        particleCount: 30,
        angle: 270,
        spread: 120,
        origin: { x: x / window.innerWidth, y: (y + 50) / window.innerHeight },
        colors: ['#333', '#666'],
        gravity: 4,
        scalar: 0.8,
        startVelocity: 40
      })
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-8 overflow-hidden">
      <div className="text-center mt-10 z-10 pointer-events-none">
        <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-red-600 to-pink-600 drop-shadow-sm tracking-wider">
          2025年辛苦了
        </h2>
        <p className="text-red-700/80 mt-3 text-lg font-medium tracking-wide">
          首先让我们丢掉霉运，把这些令人讨厌的家伙拖进粉碎机里！
        </p>
      </div>

      <div className="relative w-full flex-1 z-20">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              drag
              // Removed strict constraints to allow dragging to the shredder easily
              dragConstraints={{ top: -300, left: -300, right: 300, bottom: 600 }} 
              dragElastic={0.1}
              dragSnapToOrigin={true} // Snap back if not shredded
              whileHover={{ scale: 1.1, rotate: 0, cursor: 'grab', zIndex: 100 }}
              whileDrag={{ scale: 1.2, rotate: [0, -10, 10, -10], cursor: 'grabbing', zIndex: 100 }}
              initial={{ opacity: 0, scale: 0, y: -50 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                rotate: item.rotation,
                transition: { type: 'spring', bounce: 0.5 }
              }}
              exit={{ 
                scale: 0, 
                rotate: 720, 
                opacity: 0,
                y: 200, // Suck into shredder visual
                transition: { duration: 0.5 } 
              }}
              onDragStart={handleDragStart}
              onDragEnd={(e, info) => handleDragEnd(item.id, info, item.color)}
              className="absolute w-24 h-24 sm:w-32 sm:h-32 touch-none"
              style={{
                top: `${item.y}%`,
                left: `${item.x}%`,
              }}
            >
              <div className="w-full h-full filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                {item.type === 'cloud' && <BadCloud />}
                {item.type === 'stress' && <StressMonster />}
                {item.type === 'bag' && <PoorBag />}
                {item.type === 'ghost' && <OverworkGhost />}
                {item.type === 'apple' && <RottenApple />}
                {item.type === 'mercury' && <MercuryRetrograde />}
                {item.type === 'insomnia' && <Insomnia />}
                {item.type === 'hair' && <HairLoss />}
                {item.type === 'weight' && <WeightGain />}
                {item.type === 'lag' && <Lag />}
                {item.type === 'anxiety' && <Anxiety />}
                {item.type === 'social' && <SocialDeath />}
                {item.type === 'broke' && <Broke />}
                {item.type === 'sick' && <Sickness />}
                {item.type === 'think' && <Overthinking />}
              </div>
              
              {/* Tooltip/Label */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-white/90 text-slate-800 text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-lg border-2 border-slate-200 pointer-events-none flex flex-col items-center z-50">
                <div className="absolute -top-1 w-2 h-2 bg-white/90 rotate-45 border-t-2 border-l-2 border-slate-200" />
                {item.type === 'cloud' && '坏心情'}
                {item.type === 'stress' && '压力山大'}
                {item.type === 'bag' && '空空钱袋'}
                {item.type === 'ghost' && '无休加班'}
                {item.type === 'apple' && '烂桃花'}
                {item.type === 'mercury' && '水逆退散'}
                {item.type === 'insomnia' && '失眠多梦'}
                {item.type === 'hair' && '发际线后移'}
                {item.type === 'weight' && '体重上涨'}
                {item.type === 'lag' && '网速卡顿'}
                {item.type === 'anxiety' && '精神内耗'}
                {item.type === 'social' && '当众社死'}
                {item.type === 'broke' && '月光吃土'}
                {item.type === 'sick' && '头疼脑热'}
                {item.type === 'think' && '想太多'}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Cartoon Shredder */}
      <motion.div
        ref={shredderRef}
        animate={shredderControls}
        className="relative w-72 h-48 z-10 flex flex-col items-center justify-end mb-8"
      >
         {/* Shredder Monster Body */}
        <div className="relative w-full h-40 bg-linear-to-b from-slate-700 to-slate-900 rounded-t-[3rem] border-4 border-slate-600 shadow-[0_0_50px_rgba(0,0,0,0.6)] flex flex-col items-center overflow-hidden">
            
            {/* Eyes */}
            <div className="flex gap-8 mt-6 z-20">
                <motion.div 
                    animate={{ scaleY: shredderState === 'eating' ? 0.2 : 1 }}
                    className="w-10 h-10 bg-yellow-400 rounded-full border-4 border-slate-800 flex items-center justify-center relative overflow-hidden"
                >
                    <div className="w-3 h-3 bg-black rounded-full translate-x-1" />
                </motion.div>
                <motion.div 
                    animate={{ scaleY: shredderState === 'eating' ? 0.2 : 1 }}
                    className="w-10 h-10 bg-yellow-400 rounded-full border-4 border-slate-800 flex items-center justify-center relative overflow-hidden"
                >
                    <div className="w-3 h-3 bg-black rounded-full translate-x-1" />
                </motion.div>
            </div>

            {/* Mouth / Inlet */}
            <motion.div 
                animate={{ 
                    height: shredderState === 'eating' ? 50 : 20,
                    width: shredderState === 'eating' ? 180 : 120,
                    borderRadius: shredderState === 'eating' ? '20px' : '40px'
                }}
                className="mt-6 bg-red-900 border-4 border-slate-800 relative overflow-hidden shadow-inner transition-all duration-300"
            >
                {/* Teeth */}
                <div className="absolute top-0 left-0 w-full flex justify-between px-2">
                    {Array.from({length: 6}).map((_, i) => (
                        <div key={i} className="w-4 h-4 bg-gray-200 rotate-45 -translate-y-2 border border-gray-400" />
                    ))}
                </div>
                 <div className="absolute bottom-0 left-0 w-full flex justify-between px-2">
                    {Array.from({length: 6}).map((_, i) => (
                        <div key={i} className="w-4 h-4 bg-gray-200 rotate-45 translate-y-2 border border-gray-400" />
                    ))}
                </div>
                
                {/* Throat Gradient */}
                <div className="absolute inset-0 bg-linear-to-b from-transparent to-black opacity-80" />
            </motion.div>

            {/* Label */}
            <div className="mt-auto mb-2 px-4 py-1 bg-slate-800 rounded text-[10px] text-slate-400 font-mono border border-slate-600">
                霉运垃圾桶
            </div>

            {/* Decoration */}
            <div className="absolute bottom-10 -right-6 w-12 h-24 bg-slate-600 rotate-12 rounded-lg border-2 border-slate-500 z-0" />
            <div className="absolute bottom-8 -left-6 w-10 h-20 bg-slate-600 -rotate-12 rounded-lg border-2 border-slate-500 z-0" />
        </div>
      </motion.div>
    </div>
  )
}
