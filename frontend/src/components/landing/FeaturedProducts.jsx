import { motion } from 'framer-motion'
import ProductCard from '../ProductCard'
import { ProductCardSkeleton } from '../common/Skeleton'
import { Link } from 'react-router-dom'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

export default function FeaturedProducts({ products = [], loading = false }) {
  const list = products.slice(0, 8)

  return (
    <section className="w-full py-20 lg:py-28">
      <div className="max-w-content mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            Featured Products
          </h2>
          <Link
            to="/products"
            className="inline-flex items-center font-semibold text-primary-600 dark:text-primary-400 hover:underline text-lg"
          >
            View all →
          </Link>
        </motion.div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          >
            {list.map((product) => (
              <motion.div key={product.id} variants={item}>
                <ProductCard product={product} showAddToCart />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
