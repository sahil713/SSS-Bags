import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../api/products'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProducts({ per_page: 8 })
      .then((res) => setProducts(res.data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <section className="bg-primary-700 text-white rounded-2xl p-8 md:p-12 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome to SSS BAGS</h1>
        <p className="text-primary-200 text-lg mb-6">Premium bags, backpacks & luggage for every journey.</p>
        <Link to="/products" className="inline-block bg-white text-primary-700 font-semibold px-6 py-3 rounded-lg hover:bg-primary-100 focus:ring-2 focus:ring-white">
          Shop Now
        </Link>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Products</h2>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 rounded-xl aspect-square animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
        <div className="mt-6 text-center">
          <Link to="/products" className="text-primary-700 font-semibold hover:underline focus:ring-2 focus:ring-primary-600 rounded">
            View all products →
          </Link>
        </div>
      </section>
    </div>
  )
}
