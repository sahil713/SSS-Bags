import { useEffect, useState } from 'react'
import { getProducts } from '../api/products'
import { getCategories } from '../api/categories'
import ProductCard from '../components/ProductCard'
import { ProductCardSkeleton } from '../components/common/Skeleton'

const SORT_OPTIONS = [
  { value: 'created_at-desc', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A-Z' },
]

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState({ total: 0, per_page: 20 })
  const [filters, setFilters] = useState({ category_id: '', q: '', sort: 'created_at', order: 'desc' })
  const [searchInput, setSearchInput] = useState('')

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters.category_id, filters.q, filters.sort, filters.order])

  // Debounce the search box so every keystroke doesn't refetch.
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1)
      setFilters((f) => (f.q === searchInput ? f : { ...f, q: searchInput }))
    }, 400)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput])

  const totalPages = Math.ceil(meta.total / meta.per_page) || 1
  const selectedCategory = categories.find((c) => String(c.id) === String(filters.category_id))
  const hasActiveFilters = !!filters.category_id || !!filters.q

  const clearAll = () => {
    setSearchInput('')
    setPage(1)
    setFilters((f) => ({ ...f, category_id: '', q: '' }))
  }

  return (
    <div className="w-full max-w-content mx-auto px-6 lg:px-12 py-10 lg:py-14">
      {/* Breadcrumb + heading */}
      <nav className="text-xs text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wide">
        Home <span className="mx-1.5">/</span> <span className="text-gray-600 dark:text-gray-300">Products</span>
      </nav>
      <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
          {selectedCategory ? selectedCategory.name : 'All Products'}
        </h1>
        {!loading && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {meta.total} {meta.total === 1 ? 'item' : 'items'}
          </p>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filter sidebar */}
        <aside className="md:w-60 shrink-0 md:sticky md:top-24 md:self-start space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                Filters
              </h2>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
              Category
            </p>
            <ul className="space-y-0.5">
              <li>
                <button
                  type="button"
                  onClick={() => { setPage(1); setFilters((f) => ({ ...f, category_id: '' })) }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    !filters.category_id
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  All
                </button>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => { setPage(1); setFilters((f) => ({ ...f, category_id: String(c.id) })) }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      String(filters.category_id) === String(c.id)
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-semibold'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {/* Search + sticky sort bar */}
          <div className="sticky top-16 z-10 -mx-1 px-1 py-3 bg-gray-50/90 dark:bg-gray-900/90 backdrop-blur supports-[backdrop-filter]:bg-gray-50/70 dark:supports-[backdrop-filter]:bg-gray-900/70 mb-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <span className="absolute inset-y-0 left-3.5 flex items-center text-gray-400">🔍</span>
              <input
                type="search"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white pl-10 pr-4 py-2.5 text-sm shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 hidden sm:inline">
                Sort by
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SORT_OPTIONS.map((opt) => {
                  const active = opt.value === `${filters.sort}-${filters.order}`
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        const [sort, order] = opt.value.split('-')
                        setPage(1)
                        setFilters((f) => ({ ...f, sort, order }))
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                        active
                          ? 'bg-primary-600 text-white shadow-sm'
                          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Applied filter chips */}
          {hasActiveFilters && (
            <div className="mb-5 flex flex-wrap items-center gap-2">
              {selectedCategory && (
                <span className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium">
                  {selectedCategory.name}
                  <button
                    type="button"
                    onClick={() => { setPage(1); setFilters((f) => ({ ...f, category_id: '' })) }}
                    className="w-5 h-5 rounded-full hover:bg-primary-100 dark:hover:bg-primary-800 flex items-center justify-center"
                    aria-label="Remove category filter"
                  >
                    ✕
                  </button>
                </span>
              )}
              {filters.q && (
                <span className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium">
                  "{filters.q}"
                  <button
                    type="button"
                    onClick={() => { setSearchInput(''); setPage(1); setFilters((f) => ({ ...f, q: '' })) }}
                    className="w-5 h-5 rounded-full hover:bg-primary-100 dark:hover:bg-primary-800 flex items-center justify-center"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                </span>
              )}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-24 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
              <span className="text-5xl mb-4">🛍️</span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No products found</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 max-w-xs">
                {hasActiveFilters
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : 'Check back soon — new arrivals are added regularly.'}
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="rounded-full bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-5 py-2.5 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 animate-fade-in">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} showAddToCart />
                ))}
              </div>
              {meta.total > meta.per_page && (
                <div className="mt-10 flex justify-center items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:border-primary-400 flex items-center justify-center transition-colors"
                    aria-label="Previous page"
                  >
                    ‹
                  </button>
                  <span className="px-4 py-2 rounded-full bg-primary-600 text-white text-sm font-semibold">
                    {page}
                  </span>
                  <span className="text-sm text-gray-400 dark:text-gray-500">of {totalPages}</span>
                  <button
                    type="button"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= totalPages}
                    className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:border-primary-400 flex items-center justify-center transition-colors"
                    aria-label="Next page"
                  >
                    ›
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
