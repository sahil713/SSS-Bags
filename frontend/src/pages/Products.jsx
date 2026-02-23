import { useEffect, useState } from 'react'
import { getProducts } from '../api/products'
import { getCategories } from '../api/categories'
import ProductCard from '../components/ProductCard'

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState({ total: 0, per_page: 20 })
  const [filters, setFilters] = useState({ category_id: '', q: '', sort: 'created_at', order: 'desc' })

  const load = () => {
    setLoading(true)
    const params = { page, per_page: 20, ...filters }
    if (!params.category_id) delete params.category_id
    if (!params.q) delete params.q
    getProducts(params)
      .then((res) => {
        setProducts(res.data.products || [])
        setMeta(res.data.meta || {})
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data.categories || [])).catch(() => {})
  }, [])

  useEffect(() => {
    load()
  }, [page, filters.category_id, filters.q, filters.sort, filters.order])

  const totalPages = Math.ceil(meta.total / meta.per_page) || 1

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Products</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="md:w-56 shrink-0 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={filters.category_id}
              onChange={(e) => setFilters((f) => ({ ...f, category_id: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary-600"
            >
              <option value="">All</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort</label>
            <select
              value={`${filters.sort}-${filters.order}`}
              onChange={(e) => {
                const [sort, order] = e.target.value.split('-')
                setFilters((f) => ({ ...f, sort, order }))
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary-600"
            >
              <option value="created_at-desc">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name A-Z</option>
            </select>
          </div>
        </aside>
        <div className="flex-1">
          <div className="mb-4 flex gap-2">
            <input
              type="search"
              placeholder="Search products..."
              value={filters.q}
              onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary-600"
            />
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-100 rounded-xl aspect-square animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              {meta.total > meta.per_page && (
                <div className="mt-6 flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="rounded-lg border border-primary-600 px-4 py-2 text-primary-700 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="py-2 px-4">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= totalPages}
                    className="rounded-lg border border-primary-600 px-4 py-2 text-primary-700 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
