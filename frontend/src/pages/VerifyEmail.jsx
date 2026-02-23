import { useState } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import { verifyEmail } from '../api/auth'
import { useDispatch } from 'react-redux'
import { updateUser } from '../store/slices/authSlice'
import Button from '../components/Button'
import Input from '../components/Input'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const emailFromState = location.state?.email
  const tokenFromUrl = searchParams.get('token')
  const emailFromUrl = searchParams.get('email')
  const email = emailFromState || emailFromUrl || ''
  const [token, setToken] = useState(tokenFromUrl || '')
  const [emailInput, setEmailInput] = useState(email)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    verifyEmail(emailInput, token)
      .then((res) => {
        setMessage('Email verified! You can now verify your phone.')
        dispatch(updateUser(res.data.user))
        if (tokenFromUrl) setTimeout(() => window.location.href = '/verify-otp', 1500)
      })
      .catch((err) => setError(err.response?.data?.error || 'Verification failed'))
      .finally(() => setLoading(false))
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Verify your email</h1>
      <p className="text-gray-600 mb-4">We sent a verification link to your email. Enter the token from the link below, or click the link in the email.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {message && <p className="text-green-600 text-sm">{message}</p>}
        <Input label="Email" type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} required />
        <Input label="Token (from link)" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Paste token from email link" />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Verifying...' : 'Verify'}
        </Button>
      </form>
      <p className="mt-4 text-sm text-gray-500">
        After verification, go to <a href="/verify-otp" className="text-primary-600">phone verification</a>.
      </p>
    </div>
  )
}
