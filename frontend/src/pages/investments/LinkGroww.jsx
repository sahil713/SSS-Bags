import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { linkGroww } from '../../api/investments'
import Button from '../../components/Button'
import Input from '../../components/Input'

export default function LinkGroww() {
  const navigate = useNavigate()
  const [apiKey, setApiKey] = useState('')
  const [secret, setSecret] = useState('')
  const [totpSecret, setTotpSecret] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    linkGroww({ api_key: apiKey, secret, totp_secret: totpSecret || undefined })
      .then(() => navigate('/investments'))
      .catch((err) => setError(err.response?.data?.errors?.join?.(', ') || err.response?.data?.error || 'Failed to link account'))
      .finally(() => setLoading(false))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-content mx-auto px-6 lg:px-12 py-12 lg:py-16"
    >
      <Link to="/investments" className="inline-block text-primary-600 dark:text-primary-400 hover:underline mb-6">
        ← Back to Investments
      </Link>
      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">Link Groww Account</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Enter your Groww API credentials to sync your portfolio. Get your API key from the Groww Cloud API Keys page.
      </p>

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 lg:p-8 max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}
          <Input
            label="API Key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Your Groww API key"
            required
          />
          <Input
            label="API Secret"
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Your Groww API secret"
            required
          />
          <Input
            label="TOTP Secret (optional)"
            type="text"
            value={totpSecret}
            onChange={(e) => setTotpSecret(e.target.value)}
            placeholder="For TOTP flow - no expiry"
          />
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading} className="rounded-xl px-6 py-3">
              {loading ? 'Linking…' : 'Link Account'}
            </Button>
            <Link to="/investments">
              <Button type="button" variant="outline" className="rounded-xl px-6 py-3">Cancel</Button>
            </Link>
          </div>
        </form>
      </motion.section>

      <p className="mt-6 text-sm text-gray-500 dark:text-gray-400 max-w-xl">
        Your credentials are stored securely. Groww supports API Key + Secret (daily approval) or TOTP (no expiry). See{' '}
        <a href="https://groww.in/trade-api/docs" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">
          Groww Trade API docs
        </a>{' '}
        for details.
      </p>
    </motion.div>
  )
}
