import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAdminBanners, getAdminBanner, createBanner, updateBanner, deleteBanner, activateBanner } from '../../api/admin'
import Button from '../../components/Button'

const BANNER_TYPES = [
  { value: 'homepage', label: 'Homepage' },
  { value: 'category', label: 'Category' },
  { value: 'flash_sale', label: 'Flash Sale' },
  { value: 'announcement_bar', label: 'Announcement Bar' },
]

const emptyForm = {
  title: '',
  subtitle: '',
  description: '',
  button_text: '',
  button_link: '',
  banner_type: 'homepage',
  is_active: true,
  priority: 0,
  background_color: '',
  text_color: '',
  start_date: '',
  end_date: '',
  image: null,
}

export default function AdminBanners() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [filterType, setFilterType] = useState('')

  const load = () => {
    const params = filterType ? { banner_type: filterType } : {}
    getAdminBanners(params).then((res) => setBanners(res.data.banners || [])).catch(() => setBanners([])).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [filterType])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSaving(true)
    const fd = new FormData()
    Object.keys(form).forEach((key) => {
      if (key === 'image') return
      const v = form[key]
      if (v !== '' && v !== null && v !== undefined) fd.append(key, v === true ? '1' : v)
    })
    if (form.image) fd.append('image', form.image)
    if (editingId) {
      updateBanner(editingId, fd).then(() => { setEditingId(null); setForm(emptyForm); load() }).catch((err) => alert(err.response?.data?.errors?.join?.() || 'Update failed')).finally(() => setSaving(false))
    } else {
      createBanner(fd).then(() => { setForm(emptyForm); load() }).catch((err) => alert(err.response?.data?.errors?.join?.() || 'Create failed')).finally(() => setSaving(false))
    }
  }

  const startEdit = (b) => {
    setEditingId(b.id)
    setForm({
      ...emptyForm,
      title: b.title || '',
      subtitle: b.subtitle || '',
      description: b.description || '',
      button_text: b.button_text || '',
      button_link: b.button_link || '',
      banner_type: b.banner_type || 'homepage',
      is_active: !!b.is_active,
      priority: b.priority ?? 0,
      background_color: b.background_color || '',
      text_color: b.text_color || '',
      start_date: b.start_date ? b.start_date.slice(0, 16) : '',
      end_date: b.end_date ? b.end_date.slice(0, 16) : '',
      image: null,
    })
  }

  const handleDelete = (id) => {
    if (!confirm('Soft delete this banner?')) return
    deleteBanner(id).then(() => load()).catch(() => {})
  }

  const handleActivate = (id) => {
    activateBanner(id).then(() => load()).catch(() => {})
  }

  if (loading) return <div className="animate-pulse h-64 bg-gray-100 dark:bg-gray-800 rounded-xl" />

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Banners</h1>
        <div className="flex items-center gap-2">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 text-sm">
            <option value="">All types</option>
            {BANNER_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <Link to="/admin">← Dashboard</Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-8 max-w-2xl">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">{editingId ? 'Edit banner' : 'Create banner'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
            <input name="title" value={form.title} onChange={handleChange} required className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subtitle</label>
            <input name="subtitle" value={form.subtitle} onChange={handleChange} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Banner type</label>
            <select name="banner_type" value={form.banner_type} onChange={handleChange} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2">
              {BANNER_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={2} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Button text</label>
            <input name="button_text" value={form.button_text} onChange={handleChange} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Button link</label>
            <input name="button_link" value={form.button_link} onChange={handleChange} placeholder="/products" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority (lower = first)</label>
            <input name="priority" type="number" min={0} value={form.priority} onChange={handleChange} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2" />
          </div>
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="rounded border-gray-300 text-primary-600" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start date</label>
            <input name="start_date" type="datetime-local" value={form.start_date} onChange={handleChange} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End date</label>
            <input name="end_date" type="datetime-local" value={form.end_date} onChange={handleChange} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Background color</label>
            <input name="background_color" type="text" value={form.background_color} onChange={handleChange} placeholder="#6D28D9" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Text color</label>
            <input name="text_color" type="text" value={form.text_color} onChange={handleChange} placeholder="#ffffff" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image</label>
            <input type="file" accept="image/*" onChange={(e) => setForm((f) => ({ ...f, image: e.target.files?.[0] || null }))} className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary-100 file:text-primary-700 dark:file:bg-primary-900 dark:file:text-primary-300" />
          </div>
          <div className="md:col-span-2 flex gap-2">
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update' : 'Create'}</Button>
            {editingId && <Button type="button" variant="secondary" onClick={() => { setEditingId(null); setForm(emptyForm) }}>Cancel</Button>}
          </div>
        </div>
      </form>

      <div className="space-y-4">
        {banners.map((b) => (
          <div key={b.id} className="flex flex-wrap items-center gap-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            {b.image_url && <img src={b.image_url} alt="" className="w-32 h-20 object-cover rounded" />}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-white truncate">{b.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{b.banner_type} · Priority {b.priority} · {b.is_active ? 'Active' : 'Inactive'}</p>
              {(b.start_date || b.end_date) && <p className="text-xs text-gray-400">{b.start_date && new Date(b.start_date).toLocaleString()} – {b.end_date && new Date(b.end_date).toLocaleString()}</p>}
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" className="text-sm py-1.5 px-3" onClick={() => startEdit(b)}>Edit</Button>
              <Button variant={b.is_active ? 'secondary' : 'primary'} className="text-sm py-1.5 px-3" onClick={() => handleActivate(b.id)}>{b.is_active ? 'Deactivate' : 'Activate'}</Button>
              <Button variant="danger" className="text-sm py-1.5 px-3" onClick={() => handleDelete(b.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
      {!banners.length && <p className="text-gray-500 dark:text-gray-400">No banners. Create one above.</p>}
    </div>
  )
}
