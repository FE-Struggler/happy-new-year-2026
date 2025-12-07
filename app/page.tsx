'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ImmersiveBackground } from './components/ImmersiveBackground'
import { Step1RemoveBadLuck } from './components/Step1RemoveBadLuck'
import { Step2InjectGoodLuck } from './components/Step2InjectGoodLuck'
import { Step3WishList } from './components/Step3WishList'
import { Step4LuckyWheel } from './components/Step4LuckyWheel'
import { Step5ChristmasTree } from './components/Step5ChristmasTree'
import { useStore } from './store/useStore'

export default function Home() {
  const { currentStep, unlockedSteps, setStep } = useStore()

  const steps = [
    { id: 1, component: Step1RemoveBadLuck, title: '抽走霉运' },
    { id: 2, component: Step2InjectGoodLuck, title: '注入好运' },
    { id: 3, component: Step3WishList, title: '愿望清单' },
    { id: 4, component: Step4LuckyWheel, title: '幸运转盘' },
    { id: 5, component: Step5ChristmasTree, title: '点亮未来' },
  ]

  return (
    <main className="relative w-screen h-screen overflow-hidden text-slate-800">
      <ImmersiveBackground />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 1.05 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="w-full h-full relative z-10"
        >
          {steps.map((step) => {
            if (step.id === currentStep) {
              const Component = step.component
              return <Component key={step.id} />
            }
            return null
          })}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Indicator - Removed as requested */}
    </main>
  )
}
