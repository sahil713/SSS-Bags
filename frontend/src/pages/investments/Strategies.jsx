import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getStrategies, createStrategy, updateStrategy, deleteStrategy } from '../../api/investments'
import Button from '../../components/Button'
import Input from '../../components/Input'

const STRATEGY_TYPES = [
  { value: 'rule_based', label: 'Rule-based' },
  { value: 'value', label: 'Value' },
  { value: 'growth', label: 'Growth' },
  { value: 'dividend', label: 'Dividend' }
]

export default function Strategies() {
  const [strategies, setStrategies] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState([])
  const [form, setForm] = useState({
    name: '',
    description: '',
    strategy_type: 'rule_based',
    rules: {}
  })

  const fetchStrategies = () => {
    setLoading(true)
    getStrategies()
      .then((res) => setStrategies(res.data?.strategies || []))
      .catch(() => setStrategies([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchStrategies()
  }, [])

  const resetForm = () => {
    setForm({ name: '', description: '', strategy_type: 'rule_based', rules: {} })
    setEditing(null)
    setShowForm(false)
    setErrors([])
  }

  const handleEdit = (s) => {
    setEditing(s)
    setForm({
      name: s.name,
      description: s.description || '',
      strategy_type: s.strategy_type || 'rule_based',
      rules: s.rules || {}
    })
    setShowForm(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSaving(true)
    setErrors([])
    const apiCall = editing ? updateStrategy(editing.id, form) : createStrategy(form)
    apiCall
      .then(() => {
        resetForm()
        fetchStrategies()
      })
      .catch((err) => {
        const msgs = err.response?.data?.errors || ['Failed to save strategy']
        setErrors(Array.isArray(msgs) ? msgs : [msgs])
      })
      .finally(() => setSaving(false))
  }

  const handleDelete = (id) => {
    if (!window.confirm('Delete this strategy?')) return
    deleteStrategy(id)
      .then(() => fetchStrategies())
      .catch(() => {})
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-content mx-auto px-6 lg:px-12 py-12 lg:py-16"
    >
      <div className="flex items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">Strategies</h1>
        <div className="flex gap-2">
          <Link to="/investments">
            <Button variant="outline" className="rounded-xl px-4 py-2">Back to Dashboard</Button>
          </Link>
          <Button onClick={() => { resetForm(); setShowForm(true) }} className="rounded-xl px-4 py-2">
            New Strategy
          </Button>
        </div>
      </div>

      {showForm && (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6 max-w-xl"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {editing ? 'Edit Strategy' : 'New Strategy'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.length > 0 && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
                {errors.map((e, i) => (
                  <p key={i}>{e}</p>
                ))}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
              <Input
                name="name"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Long-term value picks"
                required
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                rows={2}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5"
                placeholder="What this strategy does"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <select
                value={form.strategy_type}
                onChange={(e) => setForm((p) => ({ ...p, strategy_type: e.target.value }))}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5"
              >
                {STRATEGY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving} className="rounded-xl px-6 py-2.5">
                {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm} className="rounded-xl px-6 py-2.5">
                Cancel
              </Button>
            </div>
          </form>
        </motion.section>
      )}

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Strategies</h2>
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading…</p>
        ) : strategies.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No strategies yet. Create one to define rules based on your holdings.
          </p>
        ) : (
          <div className="space-y-3">
            {strategies.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{s.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{s.description || s.strategy_type}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleEdit(s)} className="rounded-lg px-3 py-1.5 text-sm">
                    Edit
                  </Button>
                  <Button variant="outline" onClick={() => handleDelete(s.id)} className="rounded-lg px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.section>
    </motion.div>
  )
}
