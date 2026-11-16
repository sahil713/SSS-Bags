import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getProduct, getProducts } from '../api/products'
import { addToCart, getCart } from '../api/cart'
import { useAuth } from '../hooks/useAuth'
import { useDispatch } from 'react-redux'
import { setCart } from '../store/slices/cartSlice'
import { useToast } from '../components/common/Toast'
import Button from '../components/Button'
import ProductCard from '../components/ProductCard'
import { SHOP, whatsappUrl, telUrl } from '../constants/shop'
import { formatPrice } from '../lib/format'

function ZoomableImage({ src, alt }) {
  const containerRef = useRef(null)
  const [zoom, setZoom] = useState(false)
  const [origin, setOrigin] = useState('50% 50%')

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setOrigin(`${x}% ${y}%`)
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden cursor-zoom-in"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setZoom(true)}
      onMouseLeave={() => setZoom(false)}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={src}
          src={src}
          alt={alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full h-full object-cover transition-transform duration-300 ease-out"
          style={{ transformOrigin: origin, transform: zoom ? 'scale(1.9)' : 'scale(1)' }}
        />
      </AnimatePresence>
    </div>
  )
}

const TRUST_BADGES = [
  { icon: '✓', label: 'Quality Checked In-Store' },
  { icon: '💬', label: 'WhatsApp Support' },
  { icon: '🏬', label: 'Store Pickup Available' },
]

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, isCustomer } = useAuth()
  const dispatch = useDispatch()
  const { addToast } = useToast()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)
  const [related, setRelated] = useState([])

  useEffect(() => {
    setLoading(true)
    setActiveImage(0)
    getProduct(slug)
      .then((res) => setProduct(res.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (!product?.category_id) return
    getProducts({ category_id: product.category_id, per_page: 8 })
      .then((res) => setRelated((res.data.products || []).filter((p) => p.id !== product.id)))
      .catch(() => setRelated([]))
  }, [product?.category_id, product?.id])

  const images = useMemo(() => {
    if (!product?.images?.length) return []
    return product.images
  }, [product])

  const handleAddToCart = () => {
    if (!isAuthenticated || !isCustomer) {
      navigate('/login')
      return
    }
    setAdding(true)
    addToCart(product.id, quantity)
      .then(() => getCart().then((r) => dispatch(setCart(r.data))))
      .then(() => addToast('Added to cart', 'success'))
      .catch((e) => addToast(e.response?.data?.error || 'Failed to add to cart', 'error'))
      .finally(() => setAdding(false))
  }

  if (loading || !product) {
    return (
      <div className="max-w-content mx-auto px-6 lg:px-12 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl aspect-square animate-pulse" />
          <div className="space-y-4">
            <div className="h-4 w-24 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded w-2/3 animate-pulse" />
            <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded w-1/3 animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  const price = product.effective_price ?? product.price
  const hasDiscount = product.discount_price != null && product.discount_price < product.price
  const discountPercent = hasDiscount && product.price > 0
    ? Math.round((1 - product.discount_price / product.price) * 100)
    : 0
  const inStock = product.stock_quantity > 0

  return (
    <div className="w-full">
      <div className="max-w-content mx-auto px-6 lg:px-12 pt-6">
        <nav className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 flex-wrap" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Products</Link>
          {product.category_name && (
            <>
              <span>/</span>
              <span>{product.category_name}</span>
            </>
          )}
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium truncate max-w-[220px]">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-content mx-auto px-6 lg:px-12 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="lg:flex lg:gap-4"
          >
            {images.length > 1 && (
              <div className="hidden lg:flex flex-col gap-3 shrink-0 w-20">
                {images.map((img, i) => (
                  <button
                    key={img + i}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={
                      'w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ' +
                      (i === activeImage
                        ? 'border-primary-600'
                        : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600')
                    }
                  >
                    <img src={img} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="flex-1">
              <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-soft">
                {images.length > 0 ? (
                  <ZoomableImage src={images[activeImage]} alt={product.name} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">🛍</div>
                )}
                {hasDiscount && discountPercent > 0 && (
                  <span className="absolute top-4 left-4 px-2.5 py-1 rounded-lg bg-primary-600 text-white text-xs font-bold shadow z-10">
                    -{discountPercent}%
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setWishlisted((w) => !w)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-900/80 flex items-center justify-center shadow-md hover:scale-110 transition-transform z-10"
                  aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <span className={wishlisted ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}>
                    {wishlisted ? '❤️' : '🤍'}
                  </span>
                </button>
              </div>
              {images.length > 1 && (
                <div className="mt-4 flex lg:hidden gap-3 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button
                      key={img + i}
                      type="button"
                      onClick={() => setActiveImage(i)}
                      className={
                        'shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ' +
                        (i === activeImage
                          ? 'border-primary-600'
                          : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600')
                      }
                    >
                      <img src={img} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08, ease: 'easeOut' }}
            className="lg:sticky lg:top-24"
          >
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 tracking-wide uppercase mb-2">
              {product.category_name}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
              {product.name}
            </h1>

            <div className="mt-4 flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">₹{formatPrice(price)}</span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-gray-400 line-through">MRP ₹{formatPrice(product.price)}</span>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">{discountPercent}% off</span>
                </>
              )}
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Inclusive of all taxes</p>

            <p className={'mt-4 text-sm font-medium ' + (inStock ? 'text-green-600 dark:text-green-400' : 'text-red-500')}>
              {inStock ? `In stock (${product.stock_quantity} available)` : 'Out of stock'}
            </p>

            {isCustomer && inStock && (
              <div className="mt-6 flex items-stretch gap-3">
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-11 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-medium text-gray-900 dark:text-white">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock_quantity, q + 1))}
                    className="w-10 h-11 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <Button onClick={handleAddToCart} disabled={adding} className="flex-1">
                  {adding ? 'Adding...' : 'Add to Cart'}
                </Button>
              </div>
            )}
            {!isAuthenticated && (
              <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
                <button type="button" onClick={() => navigate('/login')} className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
                  Log in
                </button>
                {' '}to add this to your cart.
              </p>
            )}

            <div className="mt-8 grid grid-cols-3 gap-2 py-5 border-y border-gray-200 dark:border-gray-700">
              {TRUST_BADGES.map((b) => (
                <div key={b.label} className="flex flex-col items-center text-center gap-1.5 px-1">
                  <span className="text-xl" aria-hidden>{b.icon}</span>
                  <span className="text-[11px] leading-tight text-gray-500 dark:text-gray-400">{b.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Visit or order this piece</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                See it in person at {SHOP.address.line1}, {SHOP.address.line2}, or message us to order.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={whatsappUrl(SHOP.phones[0].value, `Hi! I'm interested in "${product.name}" — is it available?`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium text-sm hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                >
                  💬 WhatsApp Us
                </a>
                <a
                  href={telUrl(SHOP.phones[0].value)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  📞 Call Store
                </a>
                <Link
                  to="/visit-us"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  📍 Get Directions
                </Link>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-3">Product Details</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {product.description || 'No description available.'}
              </p>
            </div>
          </motion.div>
        </div>

        {related.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5 }}
            className="mt-20 lg:mt-28"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">You may also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {related.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} showAddToCart />
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  )
}
