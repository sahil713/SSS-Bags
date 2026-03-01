import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getReports, exportReport } from '../../api/investments'
import Chart from '../../components/investments/Chart'
import Button from '../../components/Button'

export default function Reports() {
  const [snapshots, setSnapshots] = useState([])
  const [pnlChartData, setPnlChartData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getReports()
      .then((res) => {
        setSnapshots(res.data.snapshots || [])
        setPnlChartData(res.data.pnl_chart_data || [])
      })
      .catch(() => {
        setSnapshots([])
        setPnlChartData([])
      })
      .finally(() => setLoading(false))
  }, [])

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
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">Monthly & Yearly Reports</h1>
          <p className="text-gray-600 dark:text-gray-400">View your P&L reports and export to CSV.</p>
        </div>
        {!loading && snapshots?.length > 0 && (
          <Button
            variant="outline"
            className="rounded-xl px-4 py-2"
            onClick={async () => {
              try {
                const blob = await exportReport('csv')
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `portfolio_report_${new Date().toISOString().slice(0, 10)}.csv`
                a.click()
                URL.revokeObjectURL(url)
              } catch (_) {}
            }}
          >
            Export CSV
          </Button>
        )}
      </div>

      {loading ? (
        <div className="animate-pulse text-gray-500 dark:text-gray-400">Loading...</div>
      ) : snapshots.length > 0 || pnlChartData.length > 0 ? (
        <>
        {(() => {
          const valueChartData = [...snapshots].reverse().map((s) => ({
            time: (s.snapshot_date || s.synced_at)?.toString().slice(0, 10),
            value: Number(s.total_value) || 0,
            close: Number(s.total_value) || 0,
          })).filter((d) => d.time)
          return valueChartData.length > 0 ? (
            <motion.section
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Portfolio Value Trend</h2>
              <Chart data={valueChartData} height={250} type="line" />
            </motion.section>
          ) : null
        })()}
        {pnlChartData.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">P&L Trend (from manual data)</h2>
            <Chart data={pnlChartData} height={250} type="line" />
          </motion.section>
        )}
        {snapshots.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white p-4 pb-0">Portfolio Snapshots</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Date</th>
                <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">Total Value</th>
                <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">P&L</th>
                <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">P&L %</th>
              </tr>
            </thead>
            <tbody>
              {snapshots.map((s) => (
                <tr key={s.id} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 px-4 text-gray-900 dark:text-white">
                    {new Date(s.synced_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">
                    ₹{Number(s.total_value || 0).toLocaleString()}
                  </td>
                  <td className={`py-3 px-4 text-right font-medium ${Number(s.total_pnl || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{Number(s.total_pnl || 0).toLocaleString()}
                  </td>
                  <td className={`py-3 px-4 text-right font-medium ${Number(s.total_pnl_percent || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Number(s.total_pnl_percent || 0).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.section>
        )}
        </>
      ) : (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center"
        >
          <p className="text-gray-500 dark:text-gray-400">Add portfolio snapshots (Sync on Portfolio) or P&L/tax data (Data Entry) for charts.</p>
        </motion.section>
      )}
    </motion.div>
  )
}
