import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDashboard } from '../../api/admin'

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboard().then((res) => setData(res.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="animate-pulse h-64 bg-gray-100 rounded-xl" />
  if (!data) return <p className="text-gray-600">Failed to load dashboard.</p>

  const cards = [
    { label: 'Total Users', value: data.total_users, to: '/admin/users', color: 'primary' },
    { label: 'Total Orders', value: data.total_orders, to: '/admin/orders', color: 'primary' },
    { label: 'Total Products', value: data.total_products, color: 'primary' },
    { label: 'Revenue', value: `₹${Number(data.total_revenue || 0).toLocaleString()}`, color: 'primary' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <Link key={c.label} to={c.to || '#'} className="bg-white border border-gray-200 rounded-xl p-6 card-hover">
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className="text-2xl font-bold text-primary-700 mt-1">{c.value}</p>
          </Link>
        ))}
      </div>
      <div className="flex gap-4 mb-6">
        <Link to="/admin/products" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">Manage Products</Link>
        <Link to="/admin/orders" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">Manage Orders</Link>
        <Link to="/admin/users" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">Manage Users</Link>
      </div>
      <div>
        <h2 className="font-semibold text-gray-900 mb-2">Recent orders</h2>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">ID</th>
                <th className="text-left p-3">User</th>
                <th className="text-left p-3">Total</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {(data.recent_orders || []).map((o) => (
                <tr key={o.id} className="border-t border-gray-100">
                  <td className="p-3"><Link to={`/admin/orders`} className="text-primary-600 hover:underline">{o.id}</Link></td>
                  <td className="p-3">{o.user_id}</td>
                  <td className="p-3">₹{o.total_price}</td>
                  <td className="p-3">{o.status}</td>
                  <td className="p-3">{new Date(o.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
