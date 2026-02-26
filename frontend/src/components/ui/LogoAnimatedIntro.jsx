import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const BAG_ICON_ID = 'logo-intro-gradient'

export default function LogoAnimatedIntro() {
  return (
    <Link to="/" className="inline-block focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-xl">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          fill="none"
          className="w-24 h-24 md:w-32 md:h-32"
          aria-hidden="true"
          initial={{ rotate: -6 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 4, ease: [0.4, 0, 0.2, 1] }}
          whileHover={{ rotate: 12, scale: 1.05, transition: { duration: 0.4 } }}
        >
          <defs>
            <linearGradient id={BAG_ICON_ID} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#6d28d9" />
            </linearGradient>
            <filter id="intro-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g className="dark:[filter:url(#intro-glow)]" style={{ filter: 'url(#intro-glow)' }}>
            <path
              d="M12 18v18a2 2 0 002 2h20a2 2 0 002-2V18M12 18h24M12 18l2-8a2 2 0 012-2h12a2 2 0 012 2l2 8"
              stroke={`url(#${BAG_ICON_ID})`}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M20 14v-2a4 4 0 118 0v2"
              stroke={`url(#${BAG_ICON_ID})`}
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        </motion.svg>
        <motion.span
          className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          SSS BAGS
        </motion.span>
      </motion.div>
    </Link>
  )
}
