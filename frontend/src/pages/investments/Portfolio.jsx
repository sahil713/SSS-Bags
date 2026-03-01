import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getPortfolio, syncPortfolio, deleteHolding, buildPortfolioFromDocuments } from '../../api/investments'
import Button from '../../components/Button'

export default function Portfolio() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [building, setBuilding] = useState(false)
  const [deleting, setDeleting] = useState(null)

  const fetchPortfolio = () => {
    setLoading(true)
    getPortfolio()
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchPortfolio()
  }, [])

  const handleSync = () => {
    setSyncing(true)
    syncPortfolio()
      .then(() => fetchPortfolio())
      .catch(() => {})
      .finally(() => setSyncing(false))
  }

  const handleBuildFromDocs = () => {
    setBuilding(true)
    buildPortfolioFromDocuments()
      .then(() => fetchPortfolio())
      .catch(() => {})
      .finally(() => setBuilding(false))
  }

  const handleDelete = (id) => {
    if (!window.confirm('Remove this holding?')) return
    setDeleting(id)
    deleteHolding(id)
      .then(() => fetchPortfolio())
      .catch(() => {})
      .finally(() => setDeleting(null))
  }

  if (loading && !data) {
    return (
      <div className="w-full max-w-content mx-auto px-6 py-12 flex justify-center">
        <div className="animate-pulse text-gray-500 dark:text-gray-400">Loading portfolio...</div>
      </div>
    )
  }

  const hasHoldings = data?.holdings?.length > 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-content mx-auto px-6 lg:px-12 py-12 lg:py-16"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">Portfolio</h1>
        <div className="flex gap-2">
          <Link to="/investments">
            <Button variant="outline" className="rounded-xl px-4 py-2">Back to Dashboard</Button>
          </Link>
          <Link to="/investments/holdings/add">
            <Button className="rounded-xl px-4 py-2">Add Holding</Button>
          </Link>
          <Link to="/investments/upload-statement">
            <Button variant="outline" className="rounded-xl px-4 py-2">Upload Documents</Button>
          </Link>
          <Link to="/investments/data-entry">
            <Button variant="outline" className="rounded-xl px-4 py-2">Add P&L / Tax / Data</Button>
          </Link>
          <Button onClick={handleBuildFromDocs} disabled={building} variant="outline" className="rounded-xl px-4 py-2">
            {building ? 'Building…' : 'Build from Documents'}
          </Button>
          <Button onClick={handleSync} disabled={syncing} className="rounded-xl px-4 py-2">
            {syncing ? 'Syncing…' : 'Sync'}
          </Button>
        </div>
      </div>

      {!hasHoldings && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-8"
        >
          <p className="text-amber-800 dark:text-amber-200 mb-4">
            Upload Groww PDF/XLSX documents or add holdings manually to get started.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link to="/investments/upload-statement">
              <Button className="rounded-xl px-6 py-3">Upload Documents</Button>
            </Link>
            <Link to="/investments/holdings/add">
              <Button variant="outline" className="rounded-xl px-6 py-3">Add Holding</Button>
            </Link>
            <Link to="/investments/data-entry">
              <Button variant="outline" className="rounded-xl px-6 py-3">Add P&L / Tax Data</Button>
            </Link>
          </div>
        </motion.div>
      )}

      {hasHoldings && (
        <>
          <div className="grid gap-6 mb-8">
            {(data?.parsed_summary?.totals?.total_dividend > 0 || data?.parsed_summary?.totals?.realised_pnl !== undefined) && (
              <motion.section
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">From Your Documents</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {data.parsed_summary.totals.total_dividend > 0 && (
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Dividend</p>
                      <p className="font-medium text-amber-600 dark:text-amber-400">₹{Number(data.parsed_summary.totals.total_dividend).toLocaleString()}</p>
                    </div>
                  )}
                  {data.parsed_summary.totals.realised_pnl != null && data.parsed_summary.totals.realised_pnl !== 0 && (
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Realised P&L</p>
                      <p className={`font-medium ${Number(data.parsed_summary.totals.realised_pnl) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₹{Number(data.parsed_summary.totals.realised_pnl).toLocaleString()}
                      </p>
                    </div>
                  )}
                  {data.parsed_summary.totals.unrealised_pnl != null && data.parsed_summary.totals.unrealised_pnl !== 0 && (
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Unrealised P&L</p>
                      <p className={`font-medium ${Number(data.parsed_summary.totals.unrealised_pnl) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₹{Number(data.parsed_summary.totals.unrealised_pnl).toLocaleString()}
                      </p>
                    </div>
                  )}
                  {data.parsed_summary.totals.short_term_capital_gains != null && data.parsed_summary.totals.short_term_capital_gains !== 0 && (
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">STCG (Tax)</p>
                      <p className="font-medium text-gray-900 dark:text-white">₹{Number(data.parsed_summary.totals.short_term_capital_gains).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </motion.section>
            )}
            <motion.section
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Value</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">₹{Number(data?.total_value || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">P&L</p>
                  <p className={`text-xl font-semibold ${Number(data?.total_pnl || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{Number(data?.total_pnl || 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">P&L %</p>
                  <p className={`text-xl font-semibold ${Number(data?.total_pnl_percent || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Number(data?.total_pnl_percent || 0).toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Holdings</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">{data?.holdings?.length || 0}</p>
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Holdings</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      <th className="text-left py-3 px-2 text-gray-600 dark:text-gray-400">Symbol</th>
                      <th className="text-right py-3 px-2 text-gray-600 dark:text-gray-400">Qty</th>
                      <th className="text-right py-3 px-2 text-gray-600 dark:text-gray-400">Avg Price</th>
                      <th className="text-right py-3 px-2 text-gray-600 dark:text-gray-400">Value</th>
                      <th className="text-right py-3 px-2 text-gray-600 dark:text-gray-400">P&L</th>
                      <th className="text-right py-3 px-2 text-gray-600 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.holdings.map((h) => (
                      <tr key={h.id} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="py-3 px-2 font-medium text-gray-900 dark:text-white">{h.symbol || '-'}</td>
                        <td className="py-3 px-2 text-right text-gray-700 dark:text-gray-300">{h.quantity ?? '-'}</td>
                        <td className="py-3 px-2 text-right text-gray-700 dark:text-gray-300">₹{Number(h.avg_price || 0).toLocaleString()}</td>
                        <td className="py-3 px-2 text-right text-gray-700 dark:text-gray-300">₹{Number(h.value || 0).toLocaleString()}</td>
                        <td className={`py-3 px-2 text-right font-medium ${Number(h.pnl || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ₹{Number(h.pnl || 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-2 text-right">
                          <div className="flex justify-end gap-1">
                            <Link to={`/investments/holdings/${h.id}/edit`}>
                              <Button variant="outline" className="rounded-lg px-2 py-1 text-xs">Edit</Button>
                            </Link>
                            <Button
                              variant="outline"
                              className="rounded-lg px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                              onClick={() => handleDelete(h.id)}
                              disabled={deleting === h.id}
                            >
                              {deleting === h.id ? '…' : 'Delete'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.section>
          </div>
        </>
      )}
    </motion.div>
  )
}
