import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProduct } from '../api/products'
import { addToCart, getCart } from '../api/cart'
import { useAuth } from '../hooks/useAuth'
import { useDispatch } from 'react-redux'
import { setCart } from '../store/slices/cartSlice'
import Button from '../components/Button'

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, isCustomer } = useAuth()
  const dispatch = useDispatch()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    getProduct(slug)
      .then((res) => setProduct(res.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [slug])

  const handleAddToCart = () => {
    if (!isAuthenticated || !isCustomer) {
      navigate('/login')
      return
    }
    setAdding(true)
    addToCart(product.id, quantity)
      .then(() => getCart().then((r) => dispatch(setCart(r.data))))
      .then(() => navigate('/cart'))
      .catch((e) => alert(e.response?.data?.error || 'Failed to add to cart'))
      .finally(() => setAdding(false))
  }

  if (loading || !product) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-100 rounded-xl h-96 animate-pulse" />
        <div className="mt-4 h-8 bg-gray-100 rounded w-2/3 animate-pulse" />
      </div>
    )
  }

  const image = product.images?.[0]
  const price = product.effective_price ?? product.price
  const hasDiscount = product.discount_price != null && product.discount_price < product.price

  return (
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
      <div className="md:w-1/2 aspect-square bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
        {image ? (
          <img src={image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-6xl">🛍</span>
        )}
      </div>
      <div className="md:w-1/2">
        <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
        <p className="text-gray-500 mt-1">{product.category_name}</p>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-2xl font-bold text-primary-700">₹{price}</span>
          {hasDiscount && (
            <span className="text-gray-400 line-through">₹{product.price}</span>
          )}
        </div>
        <p className="mt-4 text-gray-600">{product.description || 'No description.'}</p>
        <p className="mt-2 text-sm text-gray-500">Stock: {product.stock_quantity}</p>
        {isCustomer && product.stock_quantity > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2">
              <span className="text-sm font-medium">Qty</span>
              <input
                type="number"
                min={1}
                max={product.stock_quantity}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                className="w-20 rounded border border-gray-300 px-2 py-1 text-center"
              />
            </label>
            <Button onClick={handleAddToCart} disabled={adding}>
              {adding ? 'Adding...' : 'Add to Cart'}
            </Button>
          </div>
        )}
        {!isAuthenticated && (
          <p className="mt-4 text-sm text-gray-600">
            <button type="button" onClick={() => navigate('/login')} className="text-primary-600 font-medium hover:underline">
              Log in
            </button>
            {' '}to add to cart.
          </p>
        )}
      </div>
    </div>
  )
}
