import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'

export default function CartDrawer({ isOpen, onClose }) {
  const { items, totalItems, totalPrice } = useSelector((s) => s.cart)
  const dispatch = useDispatch()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Cart ({totalItems || 0})</h2>
              <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400" aria-label="Close cart">
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {!items?.length ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">Your cart is empty.</p>
              ) : (
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0">
                        {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover" /> : <span className="flex items-center justify-center h-full text-xl">🛍</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link to={`/products/${item.slug}`} onClick={onClose} className="font-medium text-gray-900 dark:text-white truncate block hover:text-primary-600 dark:hover:text-primary-400">{item.product_name}</Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400">₹{item.price} × {item.quantity}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {items?.length > 0 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <p className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Total <span>₹{totalPrice}</span>
                </p>
                <Link to="/cart" onClick={onClose} className="block w-full text-center bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-colors">
                  View cart & checkout
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
