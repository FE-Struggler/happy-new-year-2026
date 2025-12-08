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
    
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { x, y },
      colors: ['#FFD700', '#FFA500', '#FFFFFF'],
      gravity: 0.8,
      scalar: 0.8,
      ticks: 60
    })

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
            <motion.div
              key={item.id}
              onClick={(e) => handleLetterClick(item.id, e)}
              whileHover={{ scale: isLit ? 1.1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                textShadow: isLit 
                  ? "0 0 20px #FFD700, 0 0 40px #FFA500, 0 0 60px #FF0000" 
                  : "0 0 0px transparent",
                color: isLit ? "#FFF" : "rgba(255, 215, 0, 0.2)",
                scale: isLit ? [1, 1.2, 1] : 1,
              }}
              className={`
                text-[5rem] md:text-[8rem] font-black cursor-pointer select-none transition-colors duration-300
                ${!isLit && "hover:text-yellow-500/40"}
              `}
              style={{
                WebkitTextStroke: isLit ? "none" : "2px rgba(234, 179, 8, 0.5)",
              }}
            >
              {item.label}
            </motion.div>
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
