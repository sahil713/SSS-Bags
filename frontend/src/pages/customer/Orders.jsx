import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getOrders } from '../../api/orders'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState({})

  useEffect(() => {
    setLoading(true)
    getOrders({ page, per_page: 10 })
      .then((res) => {
        setOrders(res.data.orders || [])
        setMeta(res.data.meta || {})
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [page])

  const totalPages = Math.ceil(meta.total / meta.per_page) || 1

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : orders.length === 0 ? (
        <p className="text-gray-600">No orders yet.</p>
      ) : (
        <>
          <div className="space-y-4">
            {orders.map((o) => (
              <Link key={o.id} to={`/orders/${o.id}/track`} className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-primary-300 card-hover">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">Order #{o.id}</p>
                    <p className="text-sm text-gray-500">₹{o.total_price} · {o.status}</p>
                    <p className="text-xs text-gray-400">{new Date(o.created_at).toLocaleString()}</p>
                  </div>
                  <span className="px-2 py-1 rounded text-sm bg-primary-100 text-primary-800">{o.status}</span>
                </div>
              </Link>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
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
