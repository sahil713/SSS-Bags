import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { signup } from '../api/auth'
import { setCredentials } from '../store/slices/authSlice'
import Button from '../components/Button'
import Input from '../components/Input'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone_number, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [password_confirmation, setPasswordConfirmation] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (password !== password_confirmation) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    signup({ name, email, phone_number, password, password_confirmation })
      .then((res) => {
        dispatch(setCredentials({ access_token: null, user: res.data.user }))
        navigate('/verify-email', { state: { email } })
      })
      .catch((err) => setError(err.response?.data?.errors?.[0] || err.response?.data?.error || 'Signup failed'))
      .finally(() => setLoading(false))
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Sign up</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Phone number" type="tel" value={phone_number} onChange={(e) => setPhoneNumber(e.target.value)} required />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Input label="Confirm password" type="password" value={password_confirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Creating account...' : 'Sign up'}
        </Button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Already have an account? <Link to="/login" className="text-primary-600 font-medium hover:underline">Login</Link>
      </p>
    </div>
  )
}
