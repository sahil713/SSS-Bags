import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getOrders } from '../api/orders'
import OrderCard from '../components/orders/OrderCard'

function OrderCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 animate-pulse">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1">
          <div className="h-5 w-24 bg-gray-200 dark:bg-gray-600 rounded" />
          <div className="h-4 w-32 mt-2 bg-gray-200 dark:bg-gray-600 rounded" />
        </div>
        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-600 rounded-full" />
      </div>
      <div className="mt-3 h-6 w-16 bg-gray-200 dark:bg-gray-600 rounded" />
    </div>
  )
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-52 h-52 mb-8 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/50 flex items-center justify-center text-7xl shadow-soft-lg border border-primary-200/50 dark:border-primary-700/50"
        aria-hidden
      >
        🛒
      </motion.div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No orders yet</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-sm">Start shopping to see your orders here.</p>
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-semibold shadow-lg hover:shadow-xl active:shadow-md border border-primary-500/30 hover:border-primary-400/50 transition-all duration-200"
        >
          <span>Start Shopping</span>
          <span className="text-lg" aria-hidden>→</span>
        </Link>
      </motion.div>
    </motion.div>
  )
}

export default function MyOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState({ total: 0, per_page: 10 })

  const fetchOrders = () => {
    setLoading(true)
    getOrders({ page, per_page: 10 })
      .then((res) => {
        setOrders(res.data.orders || [])
        setMeta(res.data.meta || { total: 0, per_page: 10 })
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchOrders()
  }, [page])

  const totalPages = Math.ceil((meta.total || 0) / (meta.per_page || 10)) || 1

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-content mx-auto px-6 lg:px-12 py-12 lg:py-16"
    >
      <div className="mb-8 w-full pl-0">
        <nav className="flex gap-8 w-full text-sm font-medium border-b border-gray-200 dark:border-gray-700 pb-4" aria-label="Account sections">
          <Link
            to="/profile"
            className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors pb-4 -mb-4 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 shrink-0 pl-0"
          >
            My Profile
          </Link>
          <Link to="/my-orders" className="text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400 pb-4 -mb-4 shrink-0 pl-0">
            My Orders
          </Link>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-6 mb-0 pl-0">My Orders</h1>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <OrderCardSkeleton key={i} />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} onCancel={fetchOrders} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-xl border-2 border-primary-600 dark:border-primary-500 px-5 py-2.5 text-primary-700 dark:text-primary-400 font-medium disabled:opacity-50 hover:bg-primary-50 dark:hover:bg-primary-900/30 active:scale-[0.98] shadow-md hover:shadow-lg transition-all duration-200"
              >
                Previous
              </button>
              <span className="py-2 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages}
                className="rounded-xl border-2 border-primary-600 dark:border-primary-500 px-5 py-2.5 text-primary-700 dark:text-primary-400 font-medium disabled:opacity-50 hover:bg-primary-50 dark:hover:bg-primary-900/30 active:scale-[0.98] shadow-md hover:shadow-lg transition-all duration-200"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  )
}
