import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getAdminProduct, getAdminCategories, createProduct, updateProduct, uploadImage } from '../../api/admin'
import Button from '../../components/Button'
import Input from '../../components/Input'

export default function AdminProductForm() {
  const { slug } = useParams()
  const isEdit = !!slug
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', price: '', discount_price: '', stock_quantity: 0, category_id: '', status: 'active', image_ids: [] })

  useEffect(() => {
    getAdminCategories().then((res) => setCategories(res.data.categories || [])).catch(() => {})
  }, [])

  useEffect(() => {
    if (isEdit) {
      getAdminProduct(slug).then((res) => {
        const p = res.data
        setForm({ name: p.name, description: p.description || '', price: p.price, discount_price: p.discount_price || '', stock_quantity: p.stock_quantity, category_id: p.category_id, status: p.status, image_ids: [] })
      }).catch(() => {}).finally(() => setLoading(false))
    }
  }, [isEdit, slug])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: name === 'category_id' || name === 'stock_quantity' ? (value ? Number(value) : '') : value }))
  }

  const handleFile = (e) => {
    const files = e.target.files
    if (!files?.length) return
    Promise.all([...files].map((file) => uploadImage(file)))
      .then((results) => {
        const ids = results.map((r) => r.data.signed_id).filter(Boolean)
        setForm((f) => ({ ...f, image_ids: [...(f.image_ids || []), ...ids] }))
      })
      .catch(() => alert('Upload failed'))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = { ...form, category_id: form.category_id || undefined }
    if (isEdit) {
      updateProduct(slug, payload).then(() => navigate('/admin/products')).catch(() => {}).finally(() => setSaving(false))
    } else {
      createProduct(payload).then(() => navigate('/admin/products')).catch(() => {}).finally(() => setSaving(false))
    }
  }

  if (loading && isEdit) return <div className="animate-pulse h-64 bg-gray-100 rounded-xl" />

  return (
    <div className="max-w-xl">
      <Link to="/admin/products" className="text-primary-600 hover:underline text-sm mb-4 inline-block">← Back to products</Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{isEdit ? 'Edit product' : 'Add product'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Price" name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required />
          <Input label="Discount price" name="discount_price" type="number" step="0.01" value={form.discount_price} onChange={handleChange} />
        </div>
        <Input label="Stock" name="stock_quantity" type="number" value={form.stock_quantity} onChange={handleChange} required />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select name="category_id" value={form.category_id} onChange={handleChange} required className="w-full rounded-lg border border-gray-300 px-3 py-2">
            <option value="">Select</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
          <input type="file" accept="image/*" multiple onChange={handleFile} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary-50 file:text-primary-700" />
          {form.image_ids?.length > 0 && <p className="mt-1 text-sm text-gray-500">{form.image_ids.length} image(s) selected</p>}
        </div>
        <Button type="submit" disabled={saving}>{saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}</Button>
      </form>
    </div>
  )
}
