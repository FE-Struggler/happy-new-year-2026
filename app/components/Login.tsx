'use client'

import { useState } from 'react'
import { useStore } from '../store/useStore'
import { motion } from 'framer-motion'

export default function Login() {
  const [name, setName] = useState('')
  const setUserName = useStore((state) => state.setUserName)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      setUserName(name.trim())
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-slate-800 p-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white/60 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/40"
      >
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
          欢迎来到这个神奇的网站~
        </h1>
        <p className="text-gray-600 text-center mb-8">
          在开启旅程之前，请告诉我们你的名字
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入你的名字..."
              className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/20 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition-all placeholder:text-gray-400 text-slate-800"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold text-white shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            开启旅程
          </button>
        </form>
      </motion.div>
    </div>
  )
}
