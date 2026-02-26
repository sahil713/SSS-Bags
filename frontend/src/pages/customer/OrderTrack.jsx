import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getOrder, trackOrder } from '../../api/orders'

function formatAddress(addr) {
  if (!addr) return null
  const line1 = addr.line1 ?? addr['line1']
  if (!line1) return null
  const line2 = addr.line2 ?? addr['line2']
  const city = addr.city ?? addr['city']
  const state = addr.state ?? addr['state']
  const pincode = addr.pincode ?? addr['pincode']
  const phone = addr.phone ?? addr['phone']
  const parts = [line1, line2, [city, state].filter(Boolean).join(', '), pincode].filter(Boolean)
  return { lines: parts, phone }
}

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

  if (loading || !order) return <div className="animate-pulse h-64 bg-gray-100 dark:bg-gray-800 rounded-xl" />

  const statuses = ['pending', 'confirmed', 'shipped', 'delivered']
  const currentIndex = statuses.indexOf(order.status)
  const addr = formatAddress(order.shipping_address)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-content mx-auto px-6 lg:px-12 py-12 lg:py-16"
    >
      <Link
        to="/my-orders"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-primary-600 dark:border-primary-500 text-primary-700 dark:text-primary-400 font-medium hover:bg-primary-50 dark:hover:bg-primary-900/30 active:scale-[0.98] shadow-md hover:shadow-lg transition-all duration-200 mb-8"
      >
        <span aria-hidden>←</span>
        Back to orders
      </Link>

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Order {order.order_number || `#${order.id}`}
      </h1>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-soft p-6 lg:p-8"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order summary</h2>
          <div className="space-y-2 text-gray-600 dark:text-gray-400">
            <p className="flex justify-between">
              <span>Total</span>
              <span className="font-bold text-primary-600 dark:text-primary-400 text-lg">₹{order.total_price}</span>
            </p>
            <p className="flex justify-between text-sm">
              <span>Payment</span>
              <span className="capitalize">{order.payment_status}</span>
            </p>
            <p className="text-sm pt-2 border-t border-gray-200 dark:border-gray-600">
              Placed on {new Date(order.created_at).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' })}
            </p>
          </div>
        </motion.section>

        {addr && (
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-soft p-6 lg:p-8"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Delivery address</h2>
            <address className="not-italic text-gray-600 dark:text-gray-400 space-y-0.5">
              {addr.lines.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
              {addr.phone && <p className="pt-1">Phone: {addr.phone}</p>}
            </address>
          </motion.section>
        )}
      </div>

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="mt-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-soft p-6 lg:p-8"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Status</h2>
        <div className="flex gap-2 flex-wrap">
          {statuses.map((s, i) => (
            <span
              key={s}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${
                i <= currentIndex
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}
            >
              {s}
            </span>
          ))}
        </div>
      </motion.section>

      {order.items?.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-soft p-6 lg:p-8"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Items</h2>
          <ul className="space-y-4">
            {order.items.map((i) => (
              <li key={i.id || i.product_id} className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0">
                  {i.product_image_url ? (
                    <img src={i.product_image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="flex items-center justify-center h-full text-2xl">🛍</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white">{i.product_name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ₹{i.price_at_purchase} × {i.quantity}
                  </p>
                </div>
                <p className="font-semibold text-primary-600 dark:text-primary-400 shrink-0">₹{i.subtotal}</p>
              </li>
            ))}
          </ul>
        </motion.section>
      )}
    </motion.div>
  )
}
