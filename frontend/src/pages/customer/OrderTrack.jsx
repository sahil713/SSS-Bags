import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getOrder, trackOrder } from '../../api/orders'

export default function OrderTrack() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [track, setTrack] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getOrder(id), trackOrder(id)])
      .then(([orderRes, trackRes]) => {
        setOrder(orderRes.data)
        setTrack(trackRes.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading || !order) return <div className="animate-pulse h-64 bg-gray-100 rounded-xl" />

  const statuses = ['pending', 'confirmed', 'shipped', 'delivered']
  const currentIndex = statuses.indexOf(order.status)

  return (
    <div>
      <Link to="/orders" className="text-primary-600 hover:underline text-sm mb-4 inline-block">← Back to orders</Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Order #{order.id}</h1>
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <p className="text-gray-600">Total: <span className="font-bold text-primary-700">₹{order.total_price}</span></p>
        <p className="text-sm text-gray-500 mt-1">Payment: {order.payment_status}</p>
        <p className="text-sm text-gray-500">Placed on {new Date(order.created_at).toLocaleString()}</p>
      </div>
      <div className="mb-6">
        <h2 className="font-semibold text-gray-900 mb-2">Status</h2>
        <div className="flex gap-2 flex-wrap">
          {statuses.map((s, i) => (
            <span
              key={s}
              className={`px-3 py-1.5 rounded-full text-sm ${i <= currentIndex ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
      {order.items?.length > 0 && (
        <div>
          <h2 className="font-semibold text-gray-900 mb-2">Items</h2>
          <ul className="space-y-2">
            {order.items.map((i) => (
              <li key={i.product_id} className="flex justify-between text-sm">
                <span>{i.product_name} × {i.quantity}</span>
                <span>₹{i.subtotal}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
