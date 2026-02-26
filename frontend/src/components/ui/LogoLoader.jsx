import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Logo from './Logo'

const MAX_DURATION_MS = 2800
const FADE_OUT_MS = 400

export default function LogoLoader({ onDone }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), MAX_DURATION_MS)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!visible) {
      const t = setTimeout(() => onDone?.(), FADE_OUT_MS)
      return () => clearTimeout(t)
    }
  }, [visible, onDone])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: FADE_OUT_MS / 1000, ease: 'easeInOut' }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-primary-800 via-primary-900 to-gray-900 dark:from-primary-950 dark:via-gray-900 dark:to-black pointer-events-none"
      style={{ pointerEvents: visible ? 'auto' : 'none' }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        className="mb-4"
      >
        <Logo iconOnly size="lg" animate={false} className="!text-white [&_svg]:w-20 [&_svg]:h-20" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-xl font-bold text-white tracking-tight"
      >
        SSS BAGS
      </motion.p>
    </motion.div>
  )
}
