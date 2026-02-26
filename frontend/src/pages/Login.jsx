import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { login } from '../api/auth'
import { setCredentials, setRefreshToken } from '../store/slices/authSlice'
import { getCart } from '../api/cart'
import { setCart } from '../store/slices/cartSlice'
import Button from '../components/Button'
import Input from '../components/Input'

const containerVariants = {
  hidden: { opacity: 0, scale: 0.3, rotateY: -25 },
  visible: {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 18,
      mass: 0.8,
    },
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
          transition={{ duration: 0.25, delay: 0.6 + i * 0.04 }}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </p>
  )
}

function LoginVisual() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="relative h-full min-h-[280px] lg:min-h-[60vh] flex items-center justify-center p-8"
      style={{ perspective: '1000px' }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-sm"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.1 }}
        >
          <svg viewBox="0 0 200 160" className="w-full h-auto drop-shadow-2xl" aria-hidden style={{ transform: 'translateZ(20px)' }}>
            <defs>
              <linearGradient id="bagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#6d28d9" />
              </linearGradient>
            </defs>
            <motion.path
              d="M40 50v70a4 4 0 004 4h112a4 4 0 004-4V50M40 50h120M40 50l4-16a4 4 0 014-4h88a4 4 0 014 4l4 16"
              stroke="url(#bagGrad)"
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
              stroke="url(#bagGrad)"
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
              fill="url(#bagGrad)"
              fillOpacity="0.15"
              stroke="url(#bagGrad)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            />
          </svg>
        </motion.div>
        <div className="mt-6 overflow-hidden">
          <AnimatedText text="Premium bags & luggage" className="text-center text-primary-600 dark:text-primary-400 font-semibold text-lg tracking-wide" />
        </div>
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 mx-auto w-20 h-0.5 bg-primary-500/40 rounded-full origin-center"
        />
      </motion.div>
    </motion.div>
  )
}

export default function Login() {
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'
  const [email, setEmail] = useState(location.state?.email ?? '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const successMessage = location.state?.message

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    login({ email, password })
      .then((res) => {
        dispatch(setCredentials({ access_token: res.data.access_token, user: res.data.user }))
        if (res.data.refresh_token) dispatch(setRefreshToken({ refresh_token: res.data.refresh_token }))
        if (res.data.user?.role === 'customer') {
          getCart().then((r) => dispatch(setCart(r.data))).catch(() => {})
        }
        const user = res.data.user
        if (user?.role === 'admin') {
          navigate('/admin', { replace: true })
        } else if (user && !user.active) {
          navigate(user.email_verified ? '/verify-otp' : '/verify-email', { replace: true, state: { email: user.email } })
        } else {
          navigate(from, { replace: true })
        }
      })
      .catch((err) => {
        const msg = err.response?.data?.error || 'Login failed'
        setError(msg)
      })
      .finally(() => setLoading(false))
  }

  return (
    <div className="grid lg:grid-cols-2 min-h-[calc(100vh-12rem)] lg:min-h-[calc(100vh-14rem)]">
      <div className="order-2 lg:order-1">
        <LoginVisual />
      </div>
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="order-1 lg:order-2 flex items-center justify-center p-8 lg:p-12"
      >
        <div className="w-full max-w-md text-left">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Welcome back
          </motion.h1>
          {successMessage && <p className="mb-4 text-green-600 dark:text-green-400 text-sm">{successMessage}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </motion.div>
          </form>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-sm text-gray-600 dark:text-gray-400"
          >
            Don&apos;t have an account? <Link to="/signup" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">Sign up</Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  )
}
