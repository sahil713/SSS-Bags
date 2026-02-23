import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  const image = product.images?.[0]
  const price = product.effective_price ?? product.price
  const hasDiscount = product.discount_price != null && product.discount_price < product.price

  return (
    <Link
      to={`/products/${product.slug}`}
      className="block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm card-hover transition"
    >
      <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400 text-4xl">🛍</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{product.category_name}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-bold text-primary-700">₹{price}</span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">₹{product.price}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
