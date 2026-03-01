import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getHoldings, updateHolding } from '../../api/investments'
import Button from '../../components/Button'
import Input from '../../components/Input'

export default function EditHolding() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState([])
  const [form, setForm] = useState({
    symbol: '',
    isin: '',
    name: '',
    quantity: '',
    avg_price: '',
    current_price: '',
    holding_type: 'equity',
    notes: ''
  })

  useEffect(() => {
    getHoldings()
      .then((res) => {
        const h = res.data?.holdings?.find((x) => String(x.id) === String(id))
        if (h) {
          setForm({
            symbol: h.symbol || '',
            isin: h.isin || '',
            name: h.name || '',
            quantity: String(h.quantity ?? ''),
            avg_price: String(h.avg_price ?? ''),
            current_price: h.current_price != null ? String(h.current_price) : '',
            holding_type: h.holding_type || 'equity',
            notes: h.notes || ''
          })
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors([])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSaving(true)
    setErrors([])
    const payload = {
      ...form,
      quantity: parseFloat(form.quantity) || 0,
      avg_price: parseFloat(form.avg_price) || 0,
      current_price: form.current_price ? parseFloat(form.current_price) : null
    }
    updateHolding(id, payload)
      .then(() => navigate('/investments/portfolio'))
      .catch((err) => {
        const msgs = err.response?.data?.errors || ['Failed to update holding']
        setErrors(Array.isArray(msgs) ? msgs : [msgs])
      })
      .finally(() => setSaving(false))
  }

  if (loading) {
    return (
      <div className="w-full max-w-content mx-auto px-6 py-12 flex justify-center">
        <div className="animate-pulse text-gray-500 dark:text-gray-400">Loading…</div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-content mx-auto px-6 lg:px-12 py-12 lg:py-16"
    >
      <div className="flex items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">Edit Holding</h1>
        <Link to="/investments/portfolio">
          <Button variant="outline" className="rounded-xl px-4 py-2">Back to Portfolio</Button>
        </Link>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.length > 0 && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
              {errors.map((e, i) => (
                <p key={i}>{e}</p>
              ))}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Symbol *</label>
            <Input
              name="symbol"
              value={form.symbol}
              onChange={handleChange}
              placeholder="e.g. RELIANCE, INFY"
              required
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ISIN</label>
            <Input
              name="isin"
              value={form.isin}
              onChange={handleChange}
              placeholder="e.g. INE002A01018"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Reliance Industries"
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity *</label>
              <Input
                name="quantity"
                type="number"
                step="any"
                min="0"
                value={form.quantity}
                onChange={handleChange}
                placeholder="100"
                required
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Avg Price (₹) *</label>
              <Input
                name="avg_price"
                type="number"
                step="0.01"
                min="0"
                value={form.avg_price}
                onChange={handleChange}
                placeholder="2500"
                required
                className="w-full"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Price (₹)</label>
            <Input
              name="current_price"
              type="number"
              step="0.01"
              min="0"
              value={form.current_price}
              onChange={handleChange}
              placeholder="Leave blank to use avg price"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
            <select
              name="holding_type"
              value={form.holding_type}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5"
            >
              <option value="equity">Equity</option>
              <option value="mf">Mutual Fund</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={2}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5"
              placeholder="Optional notes"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={saving} className="rounded-xl px-6 py-2.5">
              {saving ? 'Saving…' : 'Save'}
            </Button>
            <Link to="/investments/portfolio">
              <Button type="button" variant="outline" className="rounded-xl px-6 py-2.5">Cancel</Button>
            </Link>
          </div>
        </form>
      </motion.section>
    </motion.div>
  )
}
