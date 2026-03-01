import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  getPnlRecords,
  createPnlRecord,
  getTaxRecords,
  createTaxRecord,
  getTransactions,
  createTransaction,
  getSnapshots,
  createSnapshot,
} from '../../api/investments'
import Button from '../../components/Button'

const PERIOD_TYPES = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
]

export default function DataEntry() {
  const [activeTab, setActiveTab] = useState('pnl')
  const [pnlRecords, setPnlRecords] = useState([])
  const [taxRecords, setTaxRecords] = useState([])
  const [transactions, setTransactions] = useState([])
  const [snapshots, setSnapshots] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({})

  const fetchAll = () => {
    setLoading(true)
    Promise.all([
      getPnlRecords().then((r) => r.data.records || []),
      getTaxRecords().then((r) => r.data.records || []),
      getTransactions().then((r) => r.data.transactions || []),
      getSnapshots().then((r) => r.data.snapshots || []),
    ])
      .then(([pnl, tax, tx, snap]) => {
        setPnlRecords(pnl)
        setTaxRecords(tax)
        setTransactions(tx)
        setSnapshots(snap)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const resetForm = () => {
    if (activeTab === 'pnl') {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      setForm({
        period_type: 'monthly',
        period_start: start.toISOString().slice(0, 10),
        period_end: end.toISOString().slice(0, 10),
        realised_pnl: '',
        unrealised_pnl: '',
        dividend_income: '',
        intraday_pnl: '',
        fno_pnl: '',
        total_charges: '',
        notes: '',
      })
    } else if (activeTab === 'tax') {
      const fy = new Date().getMonth() >= 3
        ? `${new Date().getFullYear()}-${String(new Date().getFullYear() + 1).slice(-2)}`
        : `${new Date().getFullYear() - 1}-${String(new Date().getFullYear()).slice(-2)}`
      setForm({
        financial_year: fy,
        elss_deduction: '',
        stcg_amount: '',
        ltcg_amount: '',
        intraday_pnl: '',
        notes: '',
      })
    } else if (activeTab === 'transaction') {
      setForm({
        transaction_type: 'buy',
        asset_type: 'stocks',
        symbol: '',
        name: '',
        quantity: '',
        price: '',
        amount: '',
        transaction_date: new Date().toISOString().slice(0, 10),
        notes: '',
      })
    } else if (activeTab === 'snapshot') {
      setForm({
        total_value: '',
        total_pnl: '',
        total_pnl_percent: '',
        snapshot_date: new Date().toISOString().slice(0, 10),
      })
    }
  }

  useEffect(() => {
    resetForm()
  }, [activeTab])

  const handleSubmit = (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = Object.fromEntries(
      Object.entries(form).filter(([, v]) => v !== '' && v != null)
    )
    if (activeTab === 'pnl') {
      createPnlRecord(payload)
        .then(() => { fetchAll(); resetForm() })
        .catch(() => {})
        .finally(() => setSaving(false))
    } else if (activeTab === 'tax') {
      createTaxRecord(payload)
        .then(() => { fetchAll(); resetForm() })
        .catch(() => {})
        .finally(() => setSaving(false))
    } else if (activeTab === 'transaction') {
      const amt = payload.quantity && payload.price ? Number(payload.quantity) * Number(payload.price) : payload.amount
      createTransaction({ ...payload, amount: amt || payload.amount || 0 })
        .then(() => { fetchAll(); resetForm() })
        .catch(() => {})
        .finally(() => setSaving(false))
    } else if (activeTab === 'snapshot') {
      createSnapshot({ ...payload, holdings: [] })
        .then(() => { fetchAll(); resetForm() })
        .catch(() => {})
        .finally(() => setSaving(false))
    }
  }

  const updateForm = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const tabs = [
    { id: 'pnl', label: 'P&L' },
    { id: 'tax', label: 'Tax' },
    { id: 'transaction', label: 'Transaction' },
    { id: 'snapshot', label: 'Portfolio Snapshot' },
  ]

  if (loading) {
    return (
      <div className="w-full max-w-content mx-auto px-6 py-12 flex justify-center">
        <div className="animate-pulse text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-content mx-auto px-6 lg:px-12 py-12 lg:py-16"
    >
      <Link to="/investments" className="inline-block text-primary-600 dark:text-primary-400 hover:underline mb-6">
        ← Back to Investments
      </Link>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Manual Data Entry</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Add P&L, tax, transactions, and portfolio snapshots for charts and insights.
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium ${
              activeTab === t.id
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Add {tabs.find((t) => t.id === activeTab)?.label}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'pnl' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Period Type</label>
                  <select
                    value={form.period_type || 'monthly'}
                    onChange={(e) => updateForm('period_type', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2"
                  >
                    {PERIOD_TYPES.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Period Start</label>
                    <input type="date" value={form.period_start || ''} onChange={(e) => updateForm('period_start', e.target.value)} required className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Period End</label>
                    <input type="date" value={form.period_end || ''} onChange={(e) => updateForm('period_end', e.target.value)} required className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {['realised_pnl', 'unrealised_pnl', 'dividend_income', 'intraday_pnl', 'fno_pnl', 'total_charges'].map((f) => (
                    <div key={f}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{f.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</label>
                      <input type="number" step="0.01" value={form[f] ?? ''} onChange={(e) => updateForm(f, e.target.value)} placeholder="0" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2" />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                  <textarea value={form.notes ?? ''} onChange={(e) => updateForm('notes', e.target.value)} rows={2} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2" />
                </div>
              </>
            )}
            {activeTab === 'tax' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Financial Year</label>
                  <input type="text" value={form.financial_year ?? ''} onChange={(e) => updateForm('financial_year', e.target.value)} placeholder="2024-25" required className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {['elss_deduction', 'stcg_amount', 'ltcg_amount', 'intraday_pnl'].map((f) => (
                    <div key={f}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{f.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</label>
                      <input type="number" step="0.01" value={form[f] ?? ''} onChange={(e) => updateForm(f, e.target.value)} placeholder="0" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2" />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                  <textarea value={form.notes ?? ''} onChange={(e) => updateForm('notes', e.target.value)} rows={2} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2" />
                </div>
              </>
            )}
            {activeTab === 'transaction' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                    <select value={form.transaction_type || 'buy'} onChange={(e) => updateForm('transaction_type', e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2">
                      <option value="buy">Buy</option>
                      <option value="sell">Sell</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Asset</label>
                    <select value={form.asset_type || 'stocks'} onChange={(e) => updateForm('asset_type', e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2">
                      <option value="stocks">Stocks</option>
                      <option value="mf">Mutual Fund</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Symbol</label>
                  <input type="text" value={form.symbol ?? ''} onChange={(e) => updateForm('symbol', e.target.value)} required placeholder="RELIANCE" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name (optional)</label>
                  <input type="text" value={form.name ?? ''} onChange={(e) => updateForm('name', e.target.value)} placeholder="Reliance Industries" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity</label>
                    <input type="number" step="0.0001" value={form.quantity ?? ''} onChange={(e) => updateForm('quantity', e.target.value)} required className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price</label>
                    <input type="number" step="0.01" value={form.price ?? ''} onChange={(e) => updateForm('price', e.target.value)} required className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
                    <input type="number" step="0.01" value={form.amount ?? (form.quantity && form.price ? Number(form.quantity) * Number(form.price) : '')} onChange={(e) => updateForm('amount', e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                  <input type="date" value={form.transaction_date ?? ''} onChange={(e) => updateForm('transaction_date', e.target.value)} required className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2" />
                </div>
              </>
            )}
            {activeTab === 'snapshot' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Snapshot Date</label>
                  <input type="date" value={form.snapshot_date ?? ''} onChange={(e) => updateForm('snapshot_date', e.target.value)} required className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Value (₹)</label>
                    <input type="number" step="0.01" value={form.total_value ?? ''} onChange={(e) => updateForm('total_value', e.target.value)} required className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">P&L (₹)</label>
                    <input type="number" step="0.01" value={form.total_pnl ?? ''} onChange={(e) => updateForm('total_pnl', e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">P&L %</label>
                    <input type="number" step="0.01" value={form.total_pnl_percent ?? ''} onChange={(e) => updateForm('total_pnl_percent', e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2" />
                  </div>
                </div>
              </>
            )}
            <Button type="submit" disabled={saving} className="rounded-xl px-6 py-2">
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </form>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 overflow-hidden"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Entries</h2>
          <div className="max-h-[400px] overflow-y-auto space-y-4">
            {activeTab === 'pnl' && pnlRecords.length === 0 && <p className="text-gray-500 dark:text-gray-400 text-sm">No P&L records yet.</p>}
            {activeTab === 'pnl' && pnlRecords.slice(0, 10).map((r) => (
              <div key={r.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-sm">
                <span className="font-medium">{r.period_start} – {r.period_end}</span>
                <p className="text-gray-600 dark:text-gray-400">Realised: ₹{Number(r.realised_pnl).toLocaleString()} | Dividend: ₹{Number(r.dividend_income).toLocaleString()}</p>
              </div>
            ))}
            {activeTab === 'tax' && taxRecords.length === 0 && <p className="text-gray-500 dark:text-gray-400 text-sm">No tax records yet.</p>}
            {activeTab === 'tax' && taxRecords.slice(0, 10).map((r) => (
              <div key={r.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-sm">
                <span className="font-medium">{r.financial_year}</span>
                <p className="text-gray-600 dark:text-gray-400">STCG: ₹{Number(r.stcg_amount).toLocaleString()} | LTCG: ₹{Number(r.ltcg_amount).toLocaleString()}</p>
              </div>
            ))}
            {activeTab === 'transaction' && transactions.length === 0 && <p className="text-gray-500 dark:text-gray-400 text-sm">No transactions yet.</p>}
            {activeTab === 'transaction' && transactions.slice(0, 10).map((t) => (
              <div key={t.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-sm">
                <span className="font-medium">{t.transaction_type.toUpperCase()} {t.symbol}</span>
                <p className="text-gray-600 dark:text-gray-400">{t.transaction_date} | Qty: {t.quantity} @ ₹{Number(t.price).toLocaleString()}</p>
              </div>
            ))}
            {activeTab === 'snapshot' && snapshots.length === 0 && <p className="text-gray-500 dark:text-gray-400 text-sm">No snapshots yet. Use Sync on Portfolio to create from holdings.</p>}
            {activeTab === 'snapshot' && snapshots.slice(0, 10).map((s) => (
              <div key={s.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-sm">
                <span className="font-medium">{s.snapshot_date || s.synced_at?.slice(0, 10)}</span>
                <p className="text-gray-600 dark:text-gray-400">Value: ₹{Number(s.total_value).toLocaleString()} | P&L: {Number(s.total_pnl_percent).toFixed(2)}%</p>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </motion.div>
  )
}
