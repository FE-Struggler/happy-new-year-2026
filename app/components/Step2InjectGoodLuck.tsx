'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import confetti from 'canvas-confetti'

const Letters = [
  { id: 'L', label: 'L' },
  { id: 'U', label: 'U' },
  { id: 'C', label: 'C' },
  { id: 'K', label: 'K' },
]

const Particle = ({ delay }: { delay: number }) => {
  const angle = Math.random() * 360
  const distance = Math.random() * 100 + 50
  const duration = Math.random() * 0.5 + 0.5
  
  return (
    <motion.div
      initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
      animate={{ 
        x: Math.cos(angle * Math.PI / 180) * distance, 
        y: Math.sin(angle * Math.PI / 180) * distance, 
        opacity: 0,
        scale: Math.random() * 0.5 + 0.5 
      }}
      transition={{ duration, ease: "easeOut", delay }}
      className="absolute w-2 h-2 rounded-full bg-linear-to-r from-yellow-300 to-amber-500 shadow-[0_0_10px_#FFD700]"
    />
  )
}

const Explosion = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
      {[...Array(12)].map((_, i) => (
        <Particle key={i} delay={i * 0.02} />
      ))}
      <motion.div
        initial={{ scale: 0, opacity: 0.5 }}
        animate={{ scale: 1.5, opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute w-32 h-32 rounded-full border-2 border-yellow-400"
      />
    </div>
  )
}

export const Step2InjectGoodLuck = () => {
  const { setStep, unlockStep } = useStore()
  const [litLetters, setLitLetters] = useState<string[]>([])
  const [isComplete, setIsComplete] = useState(false)

  const handleLetterClick = (id: string, e: React.MouseEvent) => {
    if (litLetters.includes(id) || isComplete) return

    const newLit = [...litLetters, id]
    setLitLetters(newLit)

    // Trigger local effect
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    const x = (rect.left + rect.width / 2) / window.innerWidth
    const y = (rect.top + rect.height / 2) / window.innerHeight
    
    // Enhanced confetti
    const count = 200;
    const defaults = {
      origin: { x, y }
    };

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#FFD700', '#FFA500'],
      scalar: 1.2
    });
    fire(0.2, {
      spread: 60,
      colors: ['#FFFFFF', '#FFD700'],
      scalar: 0.8
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      colors: ['#FFA500', '#FFD700']
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      colors: ['#FFFFFF']
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
      colors: ['#FFD700']
    });

    if (newLit.length === Letters.length) {
      handleComplete()
    }
  }

  const handleComplete = () => {
    setIsComplete(true)
    triggerSuccessEffect()
    setTimeout(() => {
      unlockStep(3)
      setStep(3)
    }, 4000)
  }

  const triggerSuccessEffect = () => {
    const duration = 3000
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FFD700', '#FFA500']
      })
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FFD700', '#FFA500']
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute top-10 z-10 text-center pointer-events-none">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-yellow-600 to-orange-500 drop-shadow-sm">
          第二步：注入好运
        </h2>
        <p className="text-yellow-700/80 mt-2">点击点亮屏幕上的字母，注入好运吧！</p>
      </div>

      <div className="flex gap-4 md:gap-8 z-20">
        {Letters.map((item) => {
          const isLit = litLetters.includes(item.id)
          return (
            <div key={item.id} className="relative">
              <motion.div
                onClick={(e) => handleLetterClick(item.id, e)}
                whileHover={{ scale: isLit ? 1.1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  textShadow: isLit 
                    ? "0 0 30px #FFD700, 0 0 60px #FFA500, 0 0 90px #FF8C00" 
                    : "0 0 0px transparent",
                  color: isLit ? "#FFD700" : "rgba(255, 255, 255, 0.9)",
                  scale: isLit ? [1, 1.2, 1] : 1,
                  filter: isLit ? "brightness(1.2)" : "brightness(1)"
                }}
                transition={{ duration: 0.3 }}
                className={`
                  text-[5rem] md:text-[8rem] font-black cursor-pointer select-none transition-all duration-500
                  ${!isLit && "hover:text-white hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"}
                `}
                style={{
                  WebkitTextStroke: isLit ? "none" : "3px rgba(255, 255, 255, 0.5)",
                }}
              >
                {item.label}
              </motion.div>
              {isLit && <Explosion />}
            </div>
          )
        })}
      </div>

      {/* Success Reveal */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
            className="absolute z-40 flex flex-col items-center justify-center pointer-events-none mt-40"
          >
            <h1 className="text-[4rem] md:text-[6rem] font-bold text-transparent bg-clip-text bg-linear-to-b from-yellow-300 via-yellow-100 to-yellow-500 drop-shadow-[0_0_30px_rgba(250,204,21,0.6)] font-mono tracking-tighter">
              2026
            </h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-2xl text-yellow-800 font-light tracking-widest bg-white/40 backdrop-blur-md px-8 py-2 rounded-full shadow-lg border border-white/50"
            >
              好运已注入
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
