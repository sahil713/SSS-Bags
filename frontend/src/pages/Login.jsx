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
import AuthVisual from '../components/auth/AuthVisual'

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
        <AuthVisual title="Premium bags & luggage" gradientId="bagGradLogin" />
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
