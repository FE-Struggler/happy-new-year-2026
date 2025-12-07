'use client'

import { useSearchParams } from 'next/navigation'
import { useStore, Step } from '../store/useStore'
import { useEffect, useState, Suspense } from 'react'

const DebugControls = () => {
  const searchParams = useSearchParams()
  const [isDebug, setIsDebug] = useState(false)
  const { setStep, currentStep } = useStore()

  useEffect(() => {
    if (searchParams.get('debug') === 'true') {
      setIsDebug(true)
    }
  }, [searchParams])

  if (!isDebug) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/80 text-white p-4 rounded-lg shadow-lg backdrop-blur-md border border-white/20 min-w-[120px]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold uppercase tracking-widest text-yellow-400">Debug</h3>
        <button 
          onClick={() => setIsDebug(false)}
          className="text-xs text-white/50 hover:text-white"
        >
          ✕
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {[1, 2, 3, 4, 5].map((step) => (
          <button
            key={step}
            onClick={() => setStep(step as Step)}
            className={`px-3 py-1 text-xs rounded transition-colors text-left ${
              currentStep === step 
                ? 'bg-yellow-500 text-black font-bold' 
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            Step {step}
          </button>
        ))}
      </div>
    </div>
  )
}

export const DebugPanel = () => {
  return (
    <Suspense fallback={null}>
      <DebugControls />
    </Suspense>
  )
}
