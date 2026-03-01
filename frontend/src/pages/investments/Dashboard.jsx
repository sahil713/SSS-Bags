import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getInvestmentsDashboard, buildPortfolioFromDocuments } from '../../api/investments'
import Button from '../../components/Button'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [building, setBuilding] = useState(false)

  const fetchDashboard = () => {
    setLoading(true)
    getInvestmentsDashboard()
      .then((res) => setData(res.data))
      .catch(() => setData({ portfolio: null, holdings_count: 0 }))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  const handleBuildPortfolio = () => {
    setBuilding(true)
    buildPortfolioFromDocuments()
      .then(() => fetchDashboard())
      .catch(() => {})
      .finally(() => setBuilding(false))
  }

  if (loading) {
    return (
      <div className="w-full max-w-content mx-auto px-6 py-12 flex justify-center">
        <div className="animate-pulse text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    )
  }

  const hasPortfolio = data?.holdings_count > 0 || (data?.portfolio && data.portfolio.holdings_count > 0)
  const hasDocuments = (data?.parsed_summary?.documents_parsed || 0) > 0
  const portfolio = data?.portfolio || {}
  const holdingsCount = data?.holdings_count ?? portfolio.holdings_count ?? 0
  const opportunities = data?.opportunities || []
  const parsed = data?.parsed_summary?.totals || {}

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-content mx-auto px-6 lg:px-12 py-12 lg:py-16"
    >
      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-8">Investments</h1>

      {hasDocuments && !hasPortfolio && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-6 mb-6"
        >
          <p className="text-primary-800 dark:text-primary-200 mb-4">
            You have {data.parsed_summary.documents_parsed} parsed document(s). Build your portfolio from holdings.
          </p>
          <Button onClick={handleBuildPortfolio} disabled={building} className="rounded-xl px-6 py-3">
            {building ? 'Building…' : 'Build Portfolio from Documents'}
          </Button>
        </motion.div>
      )}

      {!hasPortfolio && !hasDocuments ? (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Build your portfolio</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Upload Groww PDF/XLSX documents or add holdings manually for charts and insights.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/investments/upload-statement"
              className="inline-flex items-center justify-center rounded-xl font-semibold px-6 py-3 bg-primary-600 text-white hover:bg-primary-700 border border-primary-500/30 shadow-md"
            >
              Upload Documents
            </Link>
            <Link
              to="/investments/portfolio"
              className="inline-flex items-center justify-center rounded-xl font-semibold px-6 py-3 border-2 border-primary-600 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30"
            >
              Add Holdings Manually
            </Link>
            <Link
              to="/investments/data-entry"
              className="inline-flex items-center justify-center rounded-xl font-semibold px-6 py-3 border-2 border-primary-600 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30"
            >
              Add P&L / Tax Data
            </Link>
          </div>
        </motion.section>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Portfolio Summary</h2>
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-400">
                Total Value: <span className="font-medium text-gray-900 dark:text-white">₹{Number(portfolio.total_value || 0).toLocaleString()}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                P&L: <span className={Number(portfolio.total_pnl || 0) >= 0 ? 'text-green-600' : 'text-red-600'}>
                  ₹{Number(portfolio.total_pnl || 0).toLocaleString()} ({Number(portfolio.total_pnl_percent || 0).toFixed(2)}%)
                </span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Holdings: {holdingsCount}</p>
              {parsed.total_dividend > 0 && (
                <p className="text-sm text-amber-600 dark:text-amber-400">Dividend: ₹{Number(parsed.total_dividend).toLocaleString()}</p>
              )}
            </div>
            <div className="flex gap-2 mt-4 flex-wrap">
              <Link to="/investments/portfolio">
                <Button variant="outline" className="rounded-xl px-4 py-2 text-sm">View Portfolio</Button>
              </Link>
              <Link to="/investments/upload-statement">
                <Button variant="outline" className="rounded-xl px-4 py-2 text-sm">Upload Documents</Button>
              </Link>
              {hasDocuments && (
                <Button onClick={handleBuildPortfolio} disabled={building} variant="outline" className="rounded-xl px-4 py-2 text-sm">
                  {building ? '…' : 'Build from Documents'}
                </Button>
              )}
              <Link to="/investments/data-entry">
                <Button variant="outline" className="rounded-xl px-4 py-2 text-sm">Add Data</Button>
              </Link>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Investing Opportunities</h2>
            {opportunities.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">Add holdings and P&L/tax data to get insights.</p>
            ) : (
              <ul className="space-y-2">
                {opportunities.map((o, i) => (
                  <li
                    key={i}
                    className={`p-3 rounded-lg text-sm ${
                      o.priority === 'warning' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200' :
                      o.priority === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' :
                      o.priority === 'info' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200' :
                      'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="font-medium">{o.title}</span>
                    <p className="mt-1 text-xs opacity-90">{o.description}</p>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Links</h3>
              <div className="space-y-1 text-sm">
                <Link to="/investments/portfolio" className="block text-primary-600 dark:text-primary-400 hover:underline">Portfolio & Holdings</Link>
                <Link to="/investments/upload-statement" className="block text-primary-600 dark:text-primary-400 hover:underline">Upload Documents</Link>
                <Link to="/investments/data-entry" className="block text-primary-600 dark:text-primary-400 hover:underline">Add P&L / Tax / Data</Link>
                <Link to="/investments/strategies" className="block text-primary-600 dark:text-primary-400 hover:underline">Strategies</Link>
                <Link to="/investments/reports" className="block text-primary-600 dark:text-primary-400 hover:underline">Reports</Link>
              </div>
            </div>
          </motion.section>
        </div>
      )}
    </motion.div>
  )
}
