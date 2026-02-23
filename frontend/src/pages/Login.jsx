import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../api/auth'
import { setCredentials, setRefreshToken } from '../store/slices/authSlice'
import { getCart } from '../api/cart'
import { setCart } from '../store/slices/cartSlice'
import Button from '../components/Button'
import Input from '../components/Input'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

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
        navigate(res.data.user?.role === 'admin' ? '/admin' : from, { replace: true })
      })
      .catch((err) => {
        const msg = err.response?.data?.error || 'Login failed'
        setError(msg)
      })
      .finally(() => setLoading(false))
  }

  const needVerify = error && (error.includes('verify') || error.includes('Verify'))

  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="text-sm">
            <p className="text-red-600">{error}</p>
            {needVerify && (
              <p className="mt-2">
                <Link to="/verify-otp" state={{ email }} className="text-primary-600 font-medium hover:underline">
                  Complete phone verification →
                </Link>
              </p>
            )}
          </div>
        )}
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Don't have an account? <Link to="/signup" className="text-primary-600 font-medium hover:underline">Sign up</Link>
      </p>
    </div>
  )
}
