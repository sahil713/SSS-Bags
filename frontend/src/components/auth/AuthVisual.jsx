import { motion } from 'framer-motion'
import DustCircle from '../ui/DustCircle'

const containerVariants = {
  hidden: { opacity: 0, scale: 0.3, rotateY: -25 },
  visible: {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: { type: 'spring', stiffness: 200, damping: 18, mass: 0.8 },
  },
}

function AnimatedText({ text, className }) {
  return (
    <p className={className}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.7 + i * 0.04 }}
          className="inline-block"
        >
          {char === ' ' ? ' ' : char}
        </motion.span>
      ))}
    </p>
  )
}

export default function AuthVisual({ title, gradientId }) {
  return (
    <div className="relative h-full min-h-[280px] lg:min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-black p-8">
      <DustCircle className="w-[380px] h-[380px] sm:w-[520px] sm:h-[520px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-sm"
        style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.1 }}
          className="relative"
        >
          <span className="absolute inset-0 rounded-full bg-primary-500/40 blur-2xl animate-pulse" aria-hidden />
          <svg viewBox="0 0 200 160" className="relative w-full h-auto max-w-[180px] mx-auto drop-shadow-2xl" aria-hidden style={{ transform: 'translateZ(20px)' }}>
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
            <motion.path
              d="M40 50v70a4 4 0 004 4h112a4 4 0 004-4V50M40 50h120M40 50l4-16a4 4 0 014-4h88a4 4 0 014 4l4 16"
              stroke={`url(#${gradientId})`}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0.001 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.path
              d="M80 34v-4a8 8 0 0116 0v4"
              stroke={`url(#${gradientId})`}
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0.001 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.rect
              x="70"
              y="50"
              width="60"
              height="60"
              rx="4"
              fill={`url(#${gradientId})`}
              fillOpacity="0.15"
              stroke={`url(#${gradientId})`}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            />
          </svg>
        </motion.div>

        <div className="mt-8 overflow-hidden">
          <AnimatedText text={title} className="text-center text-white font-semibold text-lg tracking-wide" />
        </div>
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 mx-auto w-20 h-0.5 bg-primary-500/50 rounded-full origin-center"
        />
      </motion.div>
    </div>
  )
}
