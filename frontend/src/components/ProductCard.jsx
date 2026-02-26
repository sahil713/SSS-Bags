import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDispatch } from 'react-redux'
import { useAuth } from '../hooks/useAuth'
import { addToCart, getCart } from '../api/cart'
import { setCart } from '../store/slices/cartSlice'
import { useToast } from './common/Toast'

export default function ProductCard({ product, showAddToCart = false }) {
  const images = product.images || []
  const primaryImage = images[0]
  const secondaryImage = images[1] || primaryImage
  const price = product.effective_price ?? product.price
  const hasDiscount = product.discount_price != null && product.discount_price < product.price
  const discountPercent = hasDiscount && product.price > 0
    ? Math.round((1 - product.discount_price / product.price) * 100)
    : 0
  const [hover, setHover] = useState(false)
  const [adding, setAdding] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)
  const dispatch = useDispatch()
  const { isAuthenticated } = useAuth()
  const { addToast } = useToast()

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      addToast('Please log in to add to cart', 'error')
      return
    }
    setAdding(true)
    try {
      await addToCart(product.id, 1)
      const res = await getCart()
      dispatch(setCart(res.data))
      addToast('Added to cart', 'success')
    } catch (err) {
      addToast(err.response?.data?.error || 'Could not add to cart', 'error')
    } finally {
      setAdding(false)
    }
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setWishlisted((w) => !w)
    addToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist', 'info')
  }

  return (
    <Link
      to={`/products/${product.slug}`}
      className="block group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-300 dark:shadow-primary-900/10"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="aspect-square bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden relative">
        {primaryImage ? (
          <motion.div
            className="absolute inset-0 w-full h-full"
            initial={false}
            animate={{ scale: hover ? 1.08 : 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <img
              src={primaryImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {secondaryImage && secondaryImage !== primaryImage && (
              <motion.img
                src={secondaryImage}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                initial={false}
                animate={{ opacity: hover ? 1 : 0 }}
                transition={{ duration: 0.35 }}
                aria-hidden
              />
            )}
          </motion.div>
        ) : (
          <span className="text-gray-400 dark:text-gray-500 text-5xl">🛍</span>
        )}
        {hasDiscount && discountPercent > 0 && (
          <span className="absolute top-4 left-4 px-2.5 py-1 rounded-lg bg-primary-600 text-white text-xs font-bold shadow">
            -{discountPercent}%
          </span>
        )}
        <button
          type="button"
          onClick={handleWishlist}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 flex items-center justify-center shadow-md hover:scale-110 transition-transform z-10"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <span className={wishlisted ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}>
            {wishlisted ? '❤️' : '🤍'}
          </span>
        </button>
        {showAddToCart && isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: hover ? 1 : 0, y: hover ? 0 : 12 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-4 left-4 right-4 z-10"
          >
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={adding || (product.stock_quantity != null && product.stock_quantity < 1)}
              className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold disabled:opacity-50 transition-colors shadow-lg"
            >
              {adding ? 'Adding…' : 'Add to cart'}
            </button>
          </motion.div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{product.category_name}</p>
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className="text-lg font-bold text-primary-700 dark:text-primary-400">₹{price}</span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">₹{product.price}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
