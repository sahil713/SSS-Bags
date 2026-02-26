import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAdminAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement, activateAnnouncement } from '../../api/admin'
import Button from '../../components/Button'

const emptyForm = {
  message: '',
  is_active: true,
  background_color: '',
  text_color: '',
  link: '',
  start_date: '',
  end_date: '',
}

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = () => {
    getAdminAnnouncements().then((res) => setAnnouncements(res.data.announcements || [])).catch(() => setAnnouncements([])).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = { ...form }
    if (editingId) {
      updateAnnouncement(editingId, payload).then(() => { setEditingId(null); setForm(emptyForm); load() }).catch((err) => alert(err.response?.data?.errors?.join?.() || 'Update failed')).finally(() => setSaving(false))
    } else {
      createAnnouncement(payload).then(() => { setForm(emptyForm); load() }).catch((err) => alert(err.response?.data?.errors?.join?.() || 'Create failed')).finally(() => setSaving(false))
    }
  }

  const startEdit = (a) => {
    setEditingId(a.id)
    setForm({
      message: a.message || '',
      is_active: !!a.is_active,
      background_color: a.background_color || '',
      text_color: a.text_color || '',
      link: a.link || '',
      start_date: a.start_date ? a.start_date.slice(0, 16) : '',
      end_date: a.end_date ? a.end_date.slice(0, 16) : '',
    })
  }

  const handleDelete = (id) => {
    if (!confirm('Soft delete this announcement?')) return
    deleteAnnouncement(id).then(() => load()).catch(() => {})
  }

  const handleActivate = (id) => {
    activateAnnouncement(id).then(() => load()).catch(() => {})
  }

  if (loading) return <div className="animate-pulse h-64 bg-gray-100 dark:bg-gray-800 rounded-xl" />

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Announcements</h1>
        <Link to="/admin">← Dashboard</Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-8 max-w-xl">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">{editingId ? 'Edit announcement' : 'Create announcement'}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message *</label>
            <textarea name="message" value={form.message} onChange={handleChange} required rows={2} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2" placeholder="Flat 20% OFF on Premium Bags!" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Link (optional)</label>
            <input name="link" value={form.link} onChange={handleChange} placeholder="https://..." className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2" />
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="rounded border-gray-300 text-primary-600" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
            </label>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Background color</label>
              <input name="background_color" value={form.background_color} onChange={handleChange} placeholder="#6D28D9" className="w-32 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Text color</label>
              <input name="text_color" value={form.text_color} onChange={handleChange} placeholder="#ffffff" className="w-32 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start date</label>
              <input name="start_date" type="datetime-local" value={form.start_date} onChange={handleChange} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End date</label>
              <input name="end_date" type="datetime-local" value={form.end_date} onChange={handleChange} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update' : 'Create'}</Button>
            {editingId && <Button type="button" variant="secondary" onClick={() => { setEditingId(null); setForm(emptyForm) }}>Cancel</Button>}
          </div>
        </div>
      </form>

      <div className="space-y-4">
        {announcements.map((a) => (
          <div key={a.id} className="flex flex-wrap items-center gap-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 dark:text-white truncate">{a.message}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{a.is_active ? 'Active' : 'Inactive'}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" className="text-sm py-1.5 px-3" onClick={() => startEdit(a)}>Edit</Button>
              <Button variant={a.is_active ? 'secondary' : 'primary'} className="text-sm py-1.5 px-3" onClick={() => handleActivate(a.id)}>{a.is_active ? 'Deactivate' : 'Activate'}</Button>
              <Button variant="danger" className="text-sm py-1.5 px-3" onClick={() => handleDelete(a.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
      {!announcements.length && <p className="text-gray-500 dark:text-gray-400">No announcements. Create one above.</p>}
    </div>
  )
}
