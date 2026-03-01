import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getSellTiming } from '../../api/investments'
import SellTimingSelector from '../../components/investments/SellTimingSelector'

const HORIZONS = [
  { days: 1, label: '1 day' },
  { days: 5, label: '5 days' },
  { days: 15, label: '15 days' },
  { days: 30, label: '1 month' },
  { days: 90, label: '3 months' },
  { days: 180, label: '6 months' },
  { days: 365, label: '1 year' },
]

export default function SellTiming() {
  const [selected, setSelected] = useState(30)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getSellTiming(selected)
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [selected])

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
      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">Sell Timing</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Get suggestions for when to consider selling based on your selected horizon.
      </p>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <strong>Disclaimer:</strong> This is not financial advice. All suggestions are for informational purposes only.
        </p>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Select Horizon</h2>
        <SellTimingSelector value={selected} onChange={setSelected} />
      </motion.section>

      {loading ? (
        <div className="animate-pulse text-gray-500 dark:text-gray-400">Loading...</div>
      ) : data?.suggestions?.length > 0 ? (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Suggestions for {HORIZONS.find((h) => h.days === data.horizon_days)?.label || data.horizon_days} days
          </h2>
          <ul className="space-y-2">
            {data.suggestions.map((s, i) => (
              <li key={i} className="text-gray-700 dark:text-gray-300">{s.symbol || s.name}: {s.suggestion}</li>
            ))}
          </ul>
        </motion.section>
      ) : (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center"
        >
          <p className="text-gray-500 dark:text-gray-400">
            No suggestions yet. Link Groww, sync your portfolio, and check back for sell timing analysis.
          </p>
        </motion.section>
      )}
    </motion.div>
  )
}
