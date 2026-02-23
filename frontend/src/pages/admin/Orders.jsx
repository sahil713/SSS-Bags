import { useEffect, useState } from 'react'
import { getAdminOrders, updateOrderStatus } from '../../api/admin'

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState({})
  const [statusFilter, setStatusFilter] = useState('')

  const load = () => {
    setLoading(true)
    const params = { page, per_page: 20 }
    if (statusFilter) params.status = statusFilter
    getAdminOrders(params).then((res) => {
      setOrders(res.data.orders || [])
      setMeta(res.data.meta || {})
    }).catch(() => setOrders([])).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [page, statusFilter])

  const handleStatusChange = (id, status) => {
    updateOrderStatus(id, status).then(() => load()).catch(() => {})
  }

  const totalPages = Math.ceil(meta.total / meta.per_page) || 1

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>
      <div className="mb-4">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      {loading ? (
        <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">User</th>
                  <th className="text-left p-3">Total</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Date</th>
                  <th className="text-left p-3">Update</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t border-gray-100">
                    <td className="p-3 font-medium">{o.id}</td>
                    <td className="p-3">{o.user_email}</td>
                    <td className="p-3">₹{o.total_price}</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-primary-100 text-primary-800">{o.status}</span></td>
                    <td className="p-3">{new Date(o.created_at).toLocaleString()}</td>
                    <td className="p-3">
                      <select value={o.status} onChange={(e) => handleStatusChange(o.id, e.target.value)} className="rounded border border-gray-300 px-2 py-1 text-xs">
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
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
