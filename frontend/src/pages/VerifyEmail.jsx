import { useState } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import { verifyEmail, resendVerificationEmail } from '../api/auth'
import { useDispatch, useSelector } from 'react-redux'
import { setCredentials, setRefreshToken, updateUser } from '../store/slices/authSlice'
import Button from '../components/Button'
import Input from '../components/Input'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const dispatch = useDispatch()
  const { token: authToken, user } = useSelector((s) => s.auth)
  const emailFromState = location.state?.email ?? user?.email
  const isLoggedIn = !!authToken
  const tokenFromUrl = searchParams.get('token')
  const emailFromUrl = searchParams.get('email')
  const email = emailFromState || emailFromUrl || ''
  const [token, setToken] = useState(tokenFromUrl || '')
  const [emailInput, setEmailInput] = useState(email)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    verifyEmail(emailInput, token)
      .then((res) => {
        setMessage('Email verified! Redirecting to phone verification...')
        if (res.data.access_token) {
          dispatch(setCredentials({ access_token: res.data.access_token, user: res.data.user }))
          if (res.data.refresh_token) dispatch(setRefreshToken({ refresh_token: res.data.refresh_token }))
        } else {
          dispatch(updateUser(res.data.user))
        }
        const needsPhoneVerification = res.data.user && !res.data.user.phone_verified
        if (needsPhoneVerification) setTimeout(() => window.location.href = '/verify-otp', 1500)
      })
      .catch((err) => setError(err.response?.data?.error || 'Verification failed'))
      .finally(() => setLoading(false))
  }

  const handleResend = (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setResending(true)
    resendVerificationEmail()
      .then((res) => setMessage(res.data.message || 'Verification email sent. Check your inbox.'))
      .catch((err) => setError(err.response?.data?.error || 'Failed to resend'))
      .finally(() => setResending(false))
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Verify your email</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        We sent a verification link to your email. Click the link in the email, or enter the token from the link below.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}
        {message && <p className="text-green-600 dark:text-green-400 text-sm">{message}</p>}
        <Input label="Email" type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} required />
        <Input label="Token (from link)" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Paste token from email link" />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Verifying...' : 'Verify'}
        </Button>
      </form>
      {isLoggedIn && (
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Didn&apos;t get the email?{' '}
          <button type="button" onClick={handleResend} disabled={resending} className="text-primary-600 dark:text-primary-400 font-medium hover:underline disabled:opacity-50">
            {resending ? 'Sending...' : 'Resend verification email'}
          </button>
        </p>
      )}
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        After verification you&apos;ll be redirected to phone verification.
      </p>
    </div>
  )
}
