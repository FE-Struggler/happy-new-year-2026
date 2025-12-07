'use client'

import React, { useEffect, useRef, useState } from 'react'

export const ImmersiveBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden">
      {/* Fresh, bright gradient: Yellow -> Green -> Blue */}
      <div className="absolute inset-0 bg-linear-to-b from-yellow-50 via-green-100 to-blue-100" />
      <Particles />
      <SnowEffect />
    </div>
  )
}

const Particles = () => {
  const [stars, setStars] = useState<{ id: number; top: string; left: string; size: number; opacity: number; duration: number; color: string }[]>([])

  useEffect(() => {
    const count = 100
    // Colorful floating particles for a fresh vibe
    const colors = ['#fde047', '#86efac', '#93c5fd', '#fca5a5']
    
    const newStars = Array.from({ length: count }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 4 + 2, // Slightly larger
      opacity: Math.random() * 0.6 + 0.2,
      duration: Math.random() * 5 + 3,
      color: colors[Math.floor(Math.random() * colors.length)]
    }))
    setStars(newStars)
  }, [])

  return (
    <>
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full animate-pulse"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDuration: `${star.duration}s`,
            backgroundColor: star.color,
            filter: 'blur(1px)'
          }}
        />
      ))}
    </>
  )
}

const SnowEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight
    canvas.width = width
    canvas.height = height

    const particles: { x: number; y: number; radius: number; speed: number; wind: number }[] = []
    const particleCount = 80

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3 + 1,
        speed: Math.random() * 1 + 0.5,
        wind: Math.random() * 0.5 - 0.25
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      // Snow needs to be visible on light background, so use white with shadow or slightly off-white
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)'
      ctx.shadowBlur = 2
      
      ctx.beginPath()

      for (const p of particles) {
        ctx.moveTo(p.x, p.y)
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        
        p.y += p.speed
        p.x += p.wind

        if (p.y > height) {
          p.y = -5
          p.x = Math.random() * width
        }
        if (p.x > width) {
            p.x = 0
        } else if (p.x < 0) {
            p.x = width
        }
      }

      ctx.fill()
      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
}
