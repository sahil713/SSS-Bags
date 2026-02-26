import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendOtp, verifyOtp } from '../api/auth'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '../store/slices/authSlice'
import Button from '../components/Button'
import Input from '../components/Input'

export default function VerifyOtp() {
  const user = useSelector((s) => s.auth.user)
  const token = useSelector((s) => s.auth.token)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [otp, setOtp] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (!token) navigate('/login', { replace: true })
  }, [token, navigate])

  const handleSendOtp = (e) => {
    e.preventDefault()
    setError('')
    setSending(true)
    sendOtp()
      .then(() => setMessage('OTP sent to your phone'))
      .catch((err) => setError(err.response?.data?.error || 'Failed to send OTP'))
      .finally(() => setSending(false))
  }

  const handleVerify = (e) => {
    e.preventDefault()
    if (!otp.trim()) { setError('Enter the 6-digit code'); return }
    setError('')
    setLoading(true)
    verifyOtp(otp.trim())
      .then((res) => {
        dispatch(updateUser(res.data.user))
        setMessage('Phone verified! Taking you in...')
        setTimeout(() => navigate('/', { replace: true }), 1500)
      })
      .catch((err) => setError(err.response?.data?.error || 'Invalid OTP'))
      .finally(() => setLoading(false))
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Verify your phone</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        We'll send an OTP to the phone number you registered{user?.phone_number ? ` (${user.phone_number})` : ''}. Enter it below.
      </p>
      {message && <p className="text-green-600 dark:text-green-400 text-sm mb-4">{message}</p>}
      {error && <p className="text-red-600 dark:text-red-400 text-sm mb-4">{error}</p>}
      <form onSubmit={handleSendOtp} className="mb-6 space-y-4">
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
