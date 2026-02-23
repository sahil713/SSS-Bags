import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAdminProducts, getAdminCategories, deleteProduct, toggleProductStatus } from '../../api/admin'
import Button from '../../components/Button'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState({})
  const [filter, setFilter] = useState({ category_id: '', q: '' })

  const load = () => {
    setLoading(true)
    const params = { page, per_page: 20 }
    if (filter.category_id) params.category_id = filter.category_id
    if (filter.q) params.q = filter.q
    getAdminProducts(params).then((res) => {
      setProducts(res.data.products || [])
      setMeta(res.data.meta || {})
    }).catch(() => setProducts([])).finally(() => setLoading(false))
  }

  useEffect(() => {
    getAdminCategories().then((res) => setCategories(res.data.categories || [])).catch(() => {})
  }, [])

  useEffect(() => { load() }, [page, filter.category_id, filter.q])

  const handleDelete = (slug) => {
    if (!confirm('Soft delete this product?')) return
    deleteProduct(slug).then(() => load()).catch(() => {})
  }

  const handleToggle = (slug) => {
    toggleProductStatus(slug).then(() => load()).catch(() => {})
  }

  const totalPages = Math.ceil(meta.total / meta.per_page) || 1

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link to="/admin/products/new"><Button>Add product</Button></Link>
      </div>
      <div className="flex gap-4 mb-4">
        <select value={filter.category_id} onChange={(e) => setFilter((f) => ({ ...f, category_id: e.target.value }))} className="rounded-lg border border-gray-300 px-3 py-2">
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input type="search" placeholder="Search" value={filter.q} onChange={(e) => setFilter((f) => ({ ...f, q: e.target.value }))} className="rounded-lg border border-gray-300 px-3 py-2 flex-1 max-w-xs" />
      </div>
      {loading ? (
        <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Category</th>
                  <th className="text-left p-3">Price</th>
                  <th className="text-left p-3">Stock</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-gray-100">
                    <td className="p-3 font-medium">{p.name}</td>
                    <td className="p-3">{p.category_name}</td>
                    <td className="p-3">₹{p.price}</td>
                    <td className="p-3">{p.stock_quantity}</td>
                    <td className="p-3"><span className={`px-2 py-0.5 rounded ${p.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>{p.status}</span></td>
                    <td className="p-3 flex gap-2">
                      <Link to={`/admin/products/${p.slug}/edit`} className="text-primary-600 hover:underline">Edit</Link>
                      <button type="button" onClick={() => handleToggle(p.slug)} className="text-primary-600 hover:underline">Toggle</button>
                      <button type="button" onClick={() => handleDelete(p.slug)} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="rounded-lg border border-primary-600 px-4 py-2 text-primary-700 disabled:opacity-50">Previous</button>
              <span className="py-2 px-4">Page {page} of {totalPages}</span>
              <button type="button" onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages} className="rounded-lg border border-primary-600 px-4 py-2 text-primary-700 disabled:opacity-50">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
