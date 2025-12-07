'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import { Plus, Check, Sparkles } from 'lucide-react'

const COLORS = [
  'bg-yellow-200 text-yellow-900',
  'bg-pink-200 text-pink-900',
  'bg-blue-200 text-blue-900',
  'bg-green-200 text-green-900',
  'bg-purple-200 text-purple-900',
]

export const Step3WishList = () => {
  const { wishes, addWish, setStep, unlockStep, userName, setWishes } = useStore()
  const [isInputVisible, setIsInputVisible] = useState(false)
  const [currentWish, setCurrentWish] = useState('')

  useEffect(() => {
    const fetchWishes = async () => {
      if (!userName) return
      
      try {
        const response = await fetch(`/api/wish?name=${encodeURIComponent(userName)}`)
        if (response.ok) {
          const data = await response.json()
          if (data.wishes && Array.isArray(data.wishes)) {
            const currentWishes = useStore.getState().wishes
            const mergedWishes = Array.from(new Set([...currentWishes, ...data.wishes]))
            setWishes(mergedWishes)
          }
        }
      } catch (error) {
        console.error('Failed to fetch wishes:', error)
      }
    }

    fetchWishes()
  }, [userName, setWishes])

  const handleAddWish = async () => {
    if (!currentWish.trim()) return
    const wishToSave = currentWish.trim()
    
    // Optimistic UI update
    addWish(wishToSave)
    setCurrentWish('')
    setIsInputVisible(false)
    
    // Save to Supabase via API
    try {
      if (userName) {
        await fetch('/api/wish', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: userName, wish: wishToSave }),
        })
      }
    } catch (error) {
      console.error('Error saving wish to Supabase:', error)
    }
    
    // Check if enough wishes to proceed (e.g., 3)
    if (wishes.length + 1 >= 3) {
      setTimeout(() => {
        unlockStep(4)
        // Optionally auto-advance or show a "Next" button. 
        // Let's show a big button to proceed instead of auto-advancing immediately to let them admire their wishes.
      }, 1000)
    }
  }

  const handleNextStep = () => {
    setStep(4)
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center p-8 overflow-hidden">
      <div className="text-center z-10 mb-8">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-pink-500 to-purple-600 drop-shadow-sm">
          第三步：愿望清单
        </h2>
        <p className="text-purple-700/80 mt-2">写下你的2026新年愿望 ({wishes.length}/3解锁下一步)</p>
      </div>

      {/* Wishes Wall */}
      <div className="relative w-full max-w-6xl flex-1 rounded-2xl border border-black/5 bg-white/20 backdrop-blur-sm p-8 overflow-y-auto custom-scrollbar">
        <div className="flex flex-wrap gap-6 justify-center content-start min-h-full">
            <AnimatePresence>
            {wishes.map((wish, index) => {
                const rotation = (index * 7) % 10 - 5 // Deterministic rotation
                const colorClass = COLORS[index % COLORS.length]
                
                return (
                <motion.div
                    key={index}
                    initial={{ scale: 0, rotate: 0, opacity: 0 }}
                    animate={{ scale: 1, rotate: rotation, opacity: 1 }}
                    className={`relative w-48 h-48 p-6 shadow-xl ${colorClass} font-handwriting text-lg leading-relaxed flex items-center justify-center text-center transform hover:scale-110 transition-transform duration-300 cursor-default group`}
                >
                    {/* Tape visual */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-8 bg-white/30 rotate-1 backdrop-blur-sm shadow-sm" />
                    
                    {wish}

                    {/* Ribbon Decoration on Hover or randomly */}
                    <div className="absolute -bottom-2 -right-2 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Sparkles size={24} />
                    </div>
                </motion.div>
                )
            })}
            </AnimatePresence>

            {/* Add Button Placeholder */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsInputVisible(true)}
                className="w-48 h-48 border-4 border-dashed border-slate-400/30 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:text-slate-700 hover:border-slate-500/50 transition-colors"
            >
                <Plus size={48} />
                <span className="mt-2 text-sm font-medium">添加愿望</span>
            </motion.button>
        </div>
      </div>

        {/* Proceed Button */}
        {wishes.length >= 3 && (
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-10 z-20"
            >
                <button
                    onClick={handleNextStep}
                    className="px-8 py-3 bg-linear-to-r from-pink-500 to-purple-600 rounded-full text-white font-bold text-lg shadow-[0_0_20px_rgba(236,72,153,0.5)] hover:shadow-[0_0_30px_rgba(236,72,153,0.8)] transition-all transform hover:-translate-y-1"
                >
                    前往幸运转盘 &rarr;
                </button>
            </motion.div>
        )}

      {/* Input Modal */}
      <AnimatePresence>
        {isInputVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
            onClick={() => setIsInputVisible(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-4">许下一个愿望</h3>
              <textarea
                autoFocus
                value={currentWish}
                onChange={(e) => setCurrentWish(e.target.value)}
                placeholder="2026年，我希望..."
                className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none text-gray-700 text-lg"
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleAddWish()
                    }
                }}
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setIsInputVisible(false)}
                  className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium"
                >
                  取消
                </button>
                <button
                  onClick={handleAddWish}
                  disabled={!currentWish.trim()}
                  className="px-6 py-2 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Check size={18} />
                  确认
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
