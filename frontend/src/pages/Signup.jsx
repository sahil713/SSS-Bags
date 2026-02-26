import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { signup } from '../api/auth'
import { setCredentials, setRefreshToken } from '../store/slices/authSlice'
import Button from '../components/Button'
import Input from '../components/Input'
import PhoneInput from '../components/PhoneInput'

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

function SignupVisual() {
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
              <linearGradient id="bagGradSignup" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#6d28d9" />
              </linearGradient>
            </defs>
            <motion.path
              d="M40 50v70a4 4 0 004 4h112a4 4 0 004-4V50M40 50h120M40 50l4-16a4 4 0 014-4h88a4 4 0 014 4l4 16"
              stroke="url(#bagGradSignup)"
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
              stroke="url(#bagGradSignup)"
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
              fill="url(#bagGradSignup)"
              fillOpacity="0.15"
              stroke="url(#bagGradSignup)"
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
          <AnimatedText text="Join SSS BAGS" className="text-center text-primary-600 dark:text-primary-400 font-semibold text-lg tracking-wide" />
        </div>
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 mx-auto w-20 h-0.5 bg-primary-500/40 rounded-full origin-center"
        />
      </motion.div>
    </motion.div>
  )
}

function parseFieldErrors(errors) {
  if (!Array.isArray(errors) && typeof errors === 'string') return { general: errors }
  const fieldMap = {}
  const general = []
  for (const msg of errors || []) {
    const s = String(msg)
    if (/^Email\s/i.test(s)) fieldMap.email = s
    else if (/^Name\s/i.test(s)) fieldMap.name = s
    else if (/^Phone\s/i.test(s)) fieldMap.phone_number = s
    else if (/^Password\s/i.test(s) && !/confirmation/i.test(s)) fieldMap.password = s
    else if (/Password confirmation/i.test(s) || /^Confirm/i.test(s)) fieldMap.password_confirmation = s
    else general.push(s)
  }
  return { ...fieldMap, general: general.length ? general : null }
}

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone_number, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [password_confirmation, setPasswordConfirmation] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const clearFieldError = (field) => {
    setFieldErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setFieldErrors({})
    if (password !== password_confirmation) {
      setFieldErrors({ password_confirmation: 'Passwords do not match' })
      return
    }
    setLoading(true)
    signup({ name, email, phone_number, password, password_confirmation })
      .then((res) => {
        dispatch(setCredentials({ access_token: res.data.access_token, user: res.data.user }))
        if (res.data.refresh_token) dispatch(setRefreshToken({ refresh_token: res.data.refresh_token }))
        navigate('/verify-email', { replace: true, state: { email } })
      })
      .catch((err) => {
        const raw = err.response?.data?.errors || (err.response?.data?.error ? [err.response.data.error] : ['Signup failed'])
        const parsed = parseFieldErrors(raw)
        setFieldErrors(parsed)
      })
      .finally(() => setLoading(false))
  }

  const hasErrors = Object.keys(fieldErrors).length > 0
  const generalErrors = fieldErrors.general

  return (
    <div className="grid lg:grid-cols-2 min-h-[calc(100vh-12rem)] lg:min-h-[calc(100vh-14rem)]">
      <div className="order-2 lg:order-1">
        <SignupVisual />
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
            Create account
          </motion.h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            {hasErrors && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 p-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200"
                role="alert"
                aria-live="polite"
              >
                <span className="shrink-0 text-lg" aria-hidden>⚠</span>
                <div className="min-w-0 text-sm">
                  {generalErrors ? (
                    Array.isArray(generalErrors) ? (
                      <ul className="list-disc list-inside space-y-0.5">
                        {generalErrors.map((m, i) => <li key={i}>{m}</li>)}
                      </ul>
                    ) : (
                      <p>{generalErrors}</p>
                    )
                  ) : (
                    <p>Please correct the highlighted fields below and try again.</p>
                  )}
                </div>
              </motion.div>
            )}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Input
                label="Name"
                value={name}
                onChange={(e) => { setName(e.target.value); clearFieldError('name') }}
                error={fieldErrors.name}
                required
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearFieldError('email') }}
                error={fieldErrors.email}
                required
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <PhoneInput
                label="Phone number"
                value={phone_number}
                onChange={(v) => { setPhoneNumber(v); clearFieldError('phone_number') }}
                error={fieldErrors.phone_number}
                required
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearFieldError('password') }}
                error={fieldErrors.password}
                required
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <Input
                label="Confirm password"
                type="password"
                value={password_confirmation}
                onChange={(e) => { setPasswordConfirmation(e.target.value); clearFieldError('password_confirmation') }}
                error={fieldErrors.password_confirmation}
                required
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Creating account...' : 'Sign up'}
              </Button>
            </motion.div>
          </form>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-sm text-gray-600 dark:text-gray-400"
          >
            Already have an account? <Link to="/login" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">Login</Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  )
}
