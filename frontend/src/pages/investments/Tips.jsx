import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getTips } from '../../api/investments'

const MODES = [
  { id: 'rule_based', label: 'Rule-based' },
  { id: 'ai', label: 'AI' },
  { id: 'combined', label: 'Combined' },
]

export default function Tips() {
  const [mode, setMode] = useState('combined')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getTips(mode)
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [mode])

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
      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">Tips & Recommendations</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        AI and rule-based investment tips. What to buy, sell, and when.
      </p>

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6"
      >
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <strong>Disclaimer:</strong> This is not financial advice. All recommendations are for informational purposes only.
        </p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recommendation Mode</h2>
        <div className="flex flex-wrap gap-2">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                mode === m.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </motion.section>

      {loading ? (
        <div className="animate-pulse text-gray-500 dark:text-gray-400">Loading...</div>
      ) : (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recommendations</h2>
          {data?.model_based?.length > 0 && (
            <ul className="space-y-2 mb-4">
              {data.model_based.map((tip, i) => (
                <li
                  key={i}
                  className={`p-3 rounded-lg text-sm ${
                    tip.priority === 'warning' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200' :
                    tip.priority === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' :
                    tip.priority === 'info' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200' :
                    'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="font-medium">{tip.title}</span>
                  <p className="mt-1 text-xs opacity-90">{tip.description}</p>
                </li>
              ))}
            </ul>
          )}
          {data?.rule_based?.signal && (
            <div className="mb-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
              <p className="text-sm text-gray-600 dark:text-gray-400">Rule-based signal (for symbol)</p>
              <p className="font-medium text-gray-900 dark:text-white capitalize">{data.rule_based.signal}</p>
              {data.rule_based.reasons?.length > 0 && (
                <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
                  {data.rule_based.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {data?.model_based?.length === 0 && !data?.rule_based?.signal && (
            <p className="text-gray-500 dark:text-gray-400">
              Add holdings and P&L/tax data to get model-based tips. Or enter a stock symbol for rule-based signals.
            </p>
          )}
        </motion.section>
      )}
    </motion.div>
  )
}
