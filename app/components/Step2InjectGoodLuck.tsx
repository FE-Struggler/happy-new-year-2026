'use client'

import React, { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import confetti from 'canvas-confetti'

export const Step2InjectGoodLuck = () => {
  const { setStep, unlockStep } = useStore()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  
  // Track drawing state
  const isDrawing = useRef(false)
  const lastPos = useRef<{ x: number; y: number } | null>(null)
  const totalDistance = useRef(0)
  const REQUIRED_DISTANCE = 1500 // Pixels of drawing required

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Particles for the trail
    let particles: { x: number; y: number; vx: number; vy: number; life: number; color: string }[] = []

    const createParticle = (x: number, y: number) => {
      for (let i = 0; i < 3; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 1.0,
          color: `hsla(${40 + Math.random() * 20}, 100%, 70%, 1)` // Gold hues
        })
      }
    }

    const animate = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.02
        
        ctx.beginPath()
        ctx.arc(p.x, p.y, 2 * p.life, 0, Math.PI * 2)
        ctx.fillStyle = p.color.replace('1)', `${p.life})`)
        ctx.fill()

        if (p.life <= 0) particles.splice(i, 1)
      }

      requestAnimationFrame(animate)
    }
    animate()

    const handleStart = (x: number, y: number) => {
      if (isComplete) return
      isDrawing.current = true
      lastPos.current = { x, y }
      createParticle(x, y)
    }

    const handleMove = (x: number, y: number) => {
      if (!isDrawing.current || !lastPos.current || isComplete) return
      
      const dist = Math.hypot(x - lastPos.current.x, y - lastPos.current.y)
      totalDistance.current += dist
      lastPos.current = { x, y }
      createParticle(x, y)

      // Update progress
      const newProgress = Math.min(totalDistance.current / REQUIRED_DISTANCE, 1)
      setProgress(newProgress)

      if (newProgress >= 1 && !isComplete) {
        handleComplete()
      }
    }

    const handleEnd = () => {
      isDrawing.current = false
      lastPos.current = null
    }

    // Mouse events
    const onMouseDown = (e: MouseEvent) => handleStart(e.clientX, e.clientY)
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY)
    const onMouseUp = () => handleEnd()

    // Touch events
    const onTouchStart = (e: TouchEvent) => handleStart(e.touches[0].clientX, e.touches[0].clientY)
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX, e.touches[0].clientY)
    const onTouchEnd = () => handleEnd()

    canvas.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    canvas.addEventListener('touchstart', onTouchStart, { passive: false })
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd)

    return () => {
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousedown', onMouseDown)
      canvas.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [isComplete]) 

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
        <p className="text-yellow-700/80 mt-2">点亮屏幕上的字母，注入好运吧！</p>
      </div>

      {/* Guide Layer: Dotted LUCK */}
      {!isComplete && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
           <svg viewBox="0 0 600 200" className="w-[90vw] max-w-5xl h-auto">
             <text x="50%" y="50%" dy=".35em" textAnchor="middle" 
                   className="text-[8rem] md:text-[10rem] font-black fill-none stroke-yellow-500/30 stroke-[2] stroke-dasharray-[8,8]"
                   style={{ letterSpacing: '0.05em' }}
             >
               LUCK
             </text>
           </svg>
        </div>
      )}

      {/* Progress Layer: Golden LUCK Filling Up */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
         <svg viewBox="0 0 600 200" className="w-[90vw] max-w-5xl h-auto">
           {/* We use a mask or clipPath logic conceptually, here just Opacity for "filling" effect. 
               For a "filling up" effect like liquid, we'd need a clipPath rect that grows.
               Let's stick to opacity for "drawing reveals it" feel or use a clipPath.
           */}
           <defs>
             <clipPath id="text-fill">
               {/* Reveal from left to right or just global opacity */}
               <rect x="0" y="0" width={`${progress * 100}%`} height="100%" />
             </clipPath>
           </defs>
           
            <text x="50%" y="50%" dy=".35em" textAnchor="middle" 
                 className="text-[8rem] md:text-[10rem] font-black fill-yellow-400 stroke-none transition-all duration-300"
                 style={{ 
                   opacity: progress > 0 ? 1 : 0, 
                   clipPath: 'url(#text-fill)',
                   letterSpacing: '0.05em',
                   filter: 'drop-shadow(0 0 10px rgba(250, 204, 21, 0.8))'
                 }}
            >
             LUCK
           </text>
         </svg>
      </div>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-20 touch-none cursor-crosshair"
      />

      {/* Progress Indicator (Optional now since text fills up) - Let's keep it subtle or remove */}
      {!isComplete && (
        <div className="absolute bottom-10 z-30 w-64 h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700 opacity-50">
          <motion.div
            className="h-full bg-yellow-400 shadow-[0_0_10px_#facc15]"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      )}

      {/* Success Reveal */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute z-40 flex flex-col items-center justify-center pointer-events-none"
          >
             {/* We can hide the text above and show this final state, or overlay. 
                 Since the text above is SVG, let's just show the 2026 here as a final transformation.
             */}
            <h1 className="text-[6rem] md:text-[10rem] font-bold text-transparent bg-clip-text bg-linear-to-b from-yellow-300 via-yellow-100 to-yellow-500 drop-shadow-[0_0_50px_rgba(250,204,21,0.8)] font-mono tracking-tighter">
              2026
            </h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-2xl text-yellow-800 font-light tracking-widest bg-white/30 backdrop-blur-sm px-6 py-2 rounded-full shadow-sm"
            >
              好运已注入
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
