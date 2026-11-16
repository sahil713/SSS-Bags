import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { signup } from '../api/auth'
import { setCredentials, setRefreshToken } from '../store/slices/authSlice'
import Button from '../components/Button'
import Input from '../components/Input'
import PhoneInput from '../components/PhoneInput'
import AuthVisual from '../components/auth/AuthVisual'

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
        <AuthVisual title="Join SSS BAGS" gradientId="bagGradSignup" />
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
