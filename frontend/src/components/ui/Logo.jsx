import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function BagIcon({ className, animate }) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
      whileHover={animate ? { rotate: 12 } : undefined}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
      </defs>
      <path
        d="M12 18v18a2 2 0 002 2h20a2 2 0 002-2V18M12 18h24M12 18l2-8a2 2 0 012-2h12a2 2 0 012 2l2 8"
        stroke="url(#logoGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M20 14v-2a4 4 0 118 0v2"
        stroke="url(#logoGrad)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </motion.svg>
  )
}

export default function Logo({ iconOnly = false, className = '', size = 'md', animate = true }) {
  const iconSize = size === 'lg' ? 'w-14 h-14' : size === 'sm' ? 'w-8 h-8' : 'w-9 h-9'
  const textSize = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-base' : 'text-xl'

  return (
    <Link to="/" className={'inline-flex items-center gap-2 text-gray-900 dark:text-white font-bold hover:opacity-95 logo-link ' + className}>
      <BagIcon className={iconSize + ' flex-shrink-0'} animate={animate} />
      {!iconOnly && <span className={textSize + ' tracking-tight'}>SSS BAGS</span>}
    </Link>
  )
}
