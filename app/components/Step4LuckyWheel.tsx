'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { useStore } from '../store/useStore'
import confetti from 'canvas-confetti'
import { ArrowDown } from 'lucide-react'

const DEFAULT_PRIZES = [
  { label: '锦鲤附体', color: '#ff4d4d', text: '运气爆棚，万事顺遂！' },
  { label: '身体健康', color: '#2ed573', text: '吃嘛嘛香，百毒不侵！' },
  { label: '学业亨通', color: '#1e90ff', text: '逢考必过，智慧过人！' },
  { label: '心想事成', color: '#a55eea', text: '心想事成，梦想成真！' },
  { label: '智慧人生', color: '#ffa502', text: '智慧人生，智商上升！' },
  { label: '家庭幸福', color: '#f7b731', text: '家庭幸福，美满和谐！' },
  { label: '我全都要!', color: '#FFD700', text: '隐藏大奖' },
]

const COLORS = [
  '#ff4d4d',
  '#2ed573',
  '#ff78c4',
  '#1e90ff',
  '#a55eea',
  '#ffa502',
  '#ff6b81',
  '#7bed9f',
]

const TypewriterText = ({
  text,
  onComplete,
}: {
  text: string
  onComplete?: () => void
}) => {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    let index = 0
    // Reset when text changes
    setDisplayedText('')

    const timer = setInterval(() => {
      setDisplayedText(prev => text.slice(0, index + 1))
      index++
      if (index === text.length) {
        clearInterval(timer)
        onComplete?.()
      }
    }, 50)
    return () => clearInterval(timer)
  }, [text, onComplete])

  return <span>{displayedText}</span>
}

export const Step4LuckyWheel = () => {
  const { setStep, unlockStep, wishes } = useStore()
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState<{
    label: string
    color: string
    text: string
  } | null>(null)
  const controls = useAnimation()
  const [rotation, setRotation] = useState(0)

  const prizes = useMemo(() => {
    if (!wishes || wishes.length === 0) return DEFAULT_PRIZES

    const wishPrizes = wishes.map((wish, index) => ({
      label: wish.length > 4 ? wish.substring(0, 4) + '...' : wish,
      color: COLORS[(DEFAULT_PRIZES.length + index) % COLORS.length],
      text: `愿望实现：${wish}`,
    }))

    const normalPrizes = DEFAULT_PRIZES.filter(p => p.label !== '我全都要!')
    const specialPrize = DEFAULT_PRIZES.find(p => p.label === '我全都要!')!

    return [...normalPrizes, ...wishPrizes, specialPrize]
  }, [wishes])

  const spinWheel = async () => {
    if (isSpinning) return

    setIsSpinning(true)
    setResult(null)

    // Force result to be "我全都要"
    const targetLabel = '我全都要!'
    const targetIndex = prizes.findIndex(p => p.label === targetLabel)

    // Calculate rotation to land on targetIndex
    const segmentAngle = 360 / prizes.length
    // Target center of the segment
    const targetDegreesOnWheel = (targetIndex + 0.5) * segmentAngle

    // Calculate needed additional rotation
    // Current rotation % 360 gives current position
    // We want final position % 360 to be (360 - targetDegreesOnWheel)
    // because wheel rotates clockwise, so index 0 moves away from top.

    const currentRotationMod = rotation % 360
    const desiredRotationMod = (360 - targetDegreesOnWheel) % 360

    let delta = desiredRotationMod - currentRotationMod
    if (delta < 0) delta += 360

    // Add jitter
    const jitter = (Math.random() - 0.5) * (segmentAngle * 0.8)

    const finalRotation = rotation + 1800 + delta + jitter

    await controls.start({
      rotate: finalRotation,
      transition: { duration: 4, ease: [0.2, 0.8, 0.2, 1] },
    })

    setRotation(finalRotation)

    const wonPrize = prizes[targetIndex]

    // Construct special text for "我全都要!"
    let finalText = wonPrize.text
    if (wonPrize.label === '我全都要!') {
      const otherPrizes = prizes.filter(p => p.label !== '我全都要!')
      // Extract just the messages or "text" from other prizes?
      // User said: "XXX是所有奖项的内容"
      // The 'text' field contains the description.
      const allTexts = otherPrizes
        .map(p => p.text.split('：')[1] || p.text)
        .join('，')
      finalText = `恭喜你抽到隐藏大奖，2026你将获得：${allTexts}`
    }

    setResult({ ...wonPrize, text: finalText })
    triggerFireworks()

    unlockStep(5)
    setIsSpinning(false)
  }

  const triggerFireworks = () => {
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 }

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
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
        <p className="text-orange-700/80 mt-2">
          点击转盘，抽取你的2026年度关键词
        </p>
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
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full transform -rotate-90"
          >
            {prizes.map((prize, i) => {
              const angle = 360 / prizes.length
              const startAngle = (i * angle * Math.PI) / 180
              const endAngle = ((i + 1) * angle * Math.PI) / 180
              const x1 = 50 + 50 * Math.cos(startAngle)
              const y1 = 50 + 50 * Math.sin(startAngle)
              const x2 = 50 + 50 * Math.cos(endAngle)
              const y2 = 50 + 50 * Math.sin(endAngle)
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

          {prizes.map((prize, i) => {
            const angle = 360 / prizes.length
            const rotation = i * angle + angle / 2
            return (
              <div
                key={i}
                className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                <span
                  className="absolute top-[12%] left-1/2 -translate-x-1/2 text-white font-bold text-lg md:text-xl writing-vertical-rl select-none"
                  style={{ writingMode: 'vertical-rl' }}
                >
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
            className="mt-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-white/40 text-center max-w-lg shadow-xl z-50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-auto"
          >
            <h3
              className="text-3xl font-bold mb-4"
              style={{ color: result.color }}
            >
              {result.label}
            </h3>
            <p className="text-slate-700 text-lg mb-6 leading-relaxed min-h-[4rem] flex items-center justify-center">
              {result.label === '我全都要!' ? (
                <TypewriterText text={result.text} />
              ) : (
                result.text
              )}
            </p>
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-linear-to-r from-yellow-400 to-orange-500 rounded-full text-white font-bold shadow-lg hover:scale-105 transition-transform"
            >
              收下好运，去点亮圣诞树 &rarr;
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
