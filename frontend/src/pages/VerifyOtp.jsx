import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { sendOtp, verifyOtp } from '../api/auth'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '../store/slices/authSlice'
import Button from '../components/Button'
import Input from '../components/Input'

export default function VerifyOtp() {
  const user = useSelector((s) => s.auth.user)
  const location = useLocation()
  const emailFromState = location.state?.email
  const [email, setEmail] = useState(emailFromState || user?.email || '')
  const [otp, setOtp] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSendOtp = (e) => {
    e.preventDefault()
    const em = email.trim().toLowerCase()
    if (!em) { setError('Email required'); return }
    setError('')
    setSending(true)
    sendOtp(em)
      .then(() => setMessage('OTP sent to your phone'))
      .catch((err) => setError(err.response?.data?.error || 'Failed to send OTP'))
      .finally(() => setSending(false))
  }

  const handleVerify = (e) => {
    e.preventDefault()
    const em = email.trim().toLowerCase()
    if (!em) { setError('Email required'); return }
    setError('')
    setLoading(true)
    verifyOtp(em, otp)
      .then((res) => {
        dispatch(updateUser(res.data.user))
        setMessage('Phone verified! You can now login.')
        setTimeout(() => navigate('/login'), 1500)
      })
      .catch((err) => setError(err.response?.data?.error || 'Invalid OTP'))
      .finally(() => setLoading(false))
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Verify your phone</h1>
      <p className="text-gray-600 mb-4">We'll send an OTP to the phone number you registered. Enter it below.</p>
      {message && <p className="text-green-600 text-sm mb-4">{message}</p>}
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      <form onSubmit={handleSendOtp} className="mb-6 space-y-4">
        <Input label="Your email (same as signup)" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
        <Button type="submit" disabled={sending}>Send OTP to my phone</Button>
      </form>
      <p className="text-sm text-gray-500 mb-4">Already have a code? Enter it below.</p>
      <form onSubmit={handleVerify} className="space-y-4">
        <Input label="OTP code" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6-digit code" maxLength={6} />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Verifying...' : 'Verify OTP'}
        </Button>
      </form>
    </div>
  )
}
