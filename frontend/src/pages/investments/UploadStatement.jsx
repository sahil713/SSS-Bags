import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { uploadStatement, getStatements, getDocumentTypes, updateStatement, retryParseStatement } from '../../api/investments'
import Button from '../../components/Button'

export default function UploadStatement() {
  const [file, setFile] = useState(null)
  const [broker, setBroker] = useState('Groww')
  const [statementDate, setStatementDate] = useState('')
  const [docTypeValue, setDocTypeValue] = useState('holdings::stocks') // "type::sub" or "type"
  const [docTypes, setDocTypes] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [statements, setStatements] = useState([])
  const [listLoading, setListLoading] = useState(true)
  const [retrying, setRetrying] = useState(null)
  const [editingStatus, setEditingStatus] = useState(null)

  useEffect(() => {
    getDocumentTypes()
      .then((res) => {
        const types = res.data?.document_types || {}
        setDocTypes(types)
      })
      .catch(() => {})
  }, [])

  const fetchStatements = () => {
    setListLoading(true)
    getStatements()
      .then((res) => setStatements(res.data?.statements || []))
      .catch(() => setStatements([]))
      .finally(() => setListLoading(false))
  }

  useEffect(() => {
    fetchStatements()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a PDF file' })
      return
    }
    setLoading(true)
    setMessage(null)
    const [docType, docSubType] = docTypeValue.includes('::') ? docTypeValue.split('::') : [docTypeValue, null]

    uploadStatement(file, {
      broker: broker || 'Groww',
      statementDate: statementDate || undefined,
      documentType: docType || 'holdings',
      documentSubType: docSubType || undefined
    })
      .then((res) => {
        setMessage({ type: 'success', text: res.data?.message || 'Document uploaded. Parsing in progress.' })
        setFile(null)
        setStatementDate('')
        const el = document.getElementById('pdf-file')
        if (el) el.value = ''
        fetchStatements()
      })
      .catch((err) => {
        const msg = err.response?.data?.error || err.response?.data?.errors?.[0] || 'Upload failed'
        setMessage({ type: 'error', text: msg })
      })
      .finally(() => setLoading(false))
  }

  const handleRetry = (id) => {
    setRetrying(id)
    retryParseStatement(id)
      .then(() => fetchStatements())
      .catch(() => {})
      .finally(() => setRetrying(null))
  }

  const handleStatusChange = (id, newStatus) => {
    updateStatement(id, { parse_status: newStatus })
      .then(() => {
        setStatements((prev) => prev.map((s) => (s.id === id ? { ...s, parse_status: newStatus } : s)))
        setEditingStatus(null)
      })
      .catch(() => setEditingStatus(null))
  }

  const typeLabel = (type, sub) => {
    if (!docTypes) return type || '-'
    const t = docTypes[type]
    if (!t) return type
    if (sub && t.sub_types?.[sub]) return t.sub_types[sub]
    return t.label
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-content mx-auto px-6 lg:px-12 py-12 lg:py-16"
    >
      <div className="flex items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">Upload Groww PDF</h1>
        <Link to="/investments/portfolio">
          <Button variant="outline" className="rounded-xl px-4 py-2">Back to Portfolio</Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload Groww PDF</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Upload Groww PDF or XLSX: P&L, Holdings, Capital Gains, Order History, Balance Statement, Dividend Report.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {message && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  message.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                }`}
              >
                {message.text}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">PDF or XLSX File *</label>
              <input
                id="pdf-file"
                type="file"
                accept=".pdf,.xlsx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-primary-100 file:text-primary-700 dark:file:bg-primary-900/50 dark:file:text-primary-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Document Type *</label>
              <select
                value={docTypeValue}
                onChange={(e) => setDocTypeValue(e.target.value)}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5"
              >
                {!docTypes && <option value="holdings::stocks">Loading…</option>}
                {Object.entries(docTypes || {}).map(([key, config]) => (
                  <optgroup key={key} label={config.label}>
                    {Object.keys(config.sub_types || {}).length === 0 ? (
                      <option value={key}>{config.label}</option>
                    ) : (
                      Object.entries(config.sub_types || {}).map(([subKey, subLabel]) => (
                        <option key={subKey} value={`${key}::${subKey}`}>
                          {subLabel}
                        </option>
                      ))
                    )}
                  </optgroup>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Broker</label>
              <input
                type="text"
                value={broker}
                onChange={(e) => setBroker(e.target.value)}
                placeholder="Groww"
                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Statement Date</label>
              <input
                type="date"
                value={statementDate}
                onChange={(e) => setStatementDate(e.target.value)}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5"
              />
            </div>
            <Button type="submit" disabled={loading || !file} className="rounded-xl px-6 py-2.5">
              {loading ? 'Uploading…' : 'Upload & Parse'}
            </Button>
          </form>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Documents</h2>
          {listLoading ? (
            <p className="text-gray-500 dark:text-gray-400">Loading…</p>
          ) : statements.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No documents uploaded yet.</p>
          ) : (
            <ul className="space-y-2">
              {statements.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-2 py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {typeLabel(s.document_type, s.document_sub_type)}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2 text-sm">
                      {s.statement_date || new Date(s.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {editingStatus === s.id ? (
                      <select
                        value={s.parse_status}
                        onChange={(e) => handleStatusChange(s.id, e.target.value)}
                        onBlur={() => setEditingStatus(null)}
                        autoFocus
                        className="text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1"
                      >
                        <option value="pending">pending</option>
                        <option value="processing">processing</option>
                        <option value="completed">completed</option>
                        <option value="failed">failed</option>
                      </select>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => setEditingStatus(s.id)}
                          className={`text-xs px-2 py-1 rounded-full ${
                            s.parse_status === 'completed'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                              : s.parse_status === 'failed'
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                          }`}
                          title="Click to change status"
                        >
                          {s.parse_status}
                        </button>
                        {(s.parse_status === 'failed' || s.parse_status === 'pending') && (
                          <Button
                            variant="outline"
                            className="rounded-lg px-2 py-1 text-xs"
                            onClick={() => handleRetry(s.id)}
                            disabled={retrying === s.id}
                          >
                            {retrying === s.id ? '…' : 'Retry'}
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </motion.section>
      </div>
    </motion.div>
  )
}
