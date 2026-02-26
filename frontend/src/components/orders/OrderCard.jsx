import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import OrderTimeline from './OrderTimeline'
import { cancelOrder } from '../../api/orders'
import { addToCart } from '../../api/cart'
import { useToast } from '../common/Toast'

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
  delivered: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
}

export default function OrderCard({ order, onCancel }) {
  const [expanded, setExpanded] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [reordering, setReordering] = useState(false)
  const { addToast } = useToast()
  const navigate = useNavigate()

  const orderNumber = order.order_number || `ORD-${order.id}`
  const statusStyle = STATUS_STYLES[order.status] || STATUS_STYLES.pending
  const items = order.items || []

  const handleCancel = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('Cancel this order?')) return
    setCancelling(true)
    try {
      await cancelOrder(order.id)
      addToast('Order cancelled', 'success')
      onCancel?.()
    } catch (err) {
      addToast(err.response?.data?.error || 'Could not cancel order', 'error')
    } finally {
      setCancelling(false)
    }
  }

  const canCancel = order.status === 'pending'

  const handleReorder = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!items.length) return
    setReordering(true)
    try {
      for (const item of items) {
        await addToCart(item.product_id, item.quantity)
      }
      addToast('Items added to cart', 'success')
      navigate('/cart')
    } catch (err) {
      addToast(err.response?.data?.error || 'Could not add some items to cart', 'error')
    } finally {
      setReordering(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="w-full text-left px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3"
      >
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 dark:text-white truncate">{orderNumber}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {new Date(order.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className={'px-2.5 py-1 rounded-full text-xs font-medium ' + statusStyle}>
            {order.status}
          </span>
          <span className="font-bold text-primary-600 dark:text-primary-400">₹{order.total_price}</span>
          <span className="text-gray-400 dark:text-gray-500">{expanded ? '▼' : '▶'}</span>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="px-4 sm:px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
              <OrderTimeline status={order.status} />
            </div>
            <div className="px-4 sm:px-6 py-4 space-y-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Ordered items</p>
              <ul className="space-y-3">
                {(items || []).map((item) => (
                  <li key={item.id} className="flex gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0">
                      {item.product_image_url ? (
                        <img src={item.product_image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="flex items-center justify-center h-full text-2xl">🛍</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={'/products/' + (item.product_slug || '')}
                        className="font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 truncate block"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {item.product_name}
                      </Link>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ₹{item.price_at_purchase} × {item.quantity} = ₹{item.subtotal}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2 pt-2">
                <Link
                  to={'/orders/' + order.id + '/track'}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-colors"
                >
                  Track order
                </Link>
                {items.length > 0 && (
                  <button
                    type="button"
                    onClick={handleReorder}
                    disabled={reordering}
                    className="inline-flex items-center px-4 py-2 rounded-lg border border-primary-500 dark:border-primary-500 text-primary-600 dark:text-primary-400 text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 disabled:opacity-50 transition-colors"
                  >
                    {reordering ? 'Adding…' : 'Reorder'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => addToast('Invoice download coming soon', 'info')}
                  className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Download invoice
                </button>
                {canCancel && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="inline-flex items-center px-4 py-2 rounded-lg border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 transition-colors"
                  >
                    {cancelling ? 'Cancelling…' : 'Cancel order'}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
