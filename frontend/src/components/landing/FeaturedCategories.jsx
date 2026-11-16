import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CATEGORIES, STYLES } from '../../data/catalog'

// Static categories (backend disabled). The API-driven version took a
// `categories` prop from GET /categories; see git history to restore it.
export default function FeaturedCategories() {
  return (
    <section className="w-full py-20 lg:py-28">
      <div className="max-w-content mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-xl mx-auto mb-12"
        >
          <p className="text-primary-600 dark:text-primary-400 text-xs font-semibold tracking-[0.25em] uppercase mb-3">
            What we stock
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">Shop by Category</h2>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {CATEGORIES.map((cat, i) => {
            const count = STYLES.filter((s) => s.category === cat.slug).length
            return (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link
                  to={'/products?category=' + cat.slug}
                  className="block group relative rounded-2xl overflow-hidden aspect-[4/5] lg:aspect-[3/4] bg-gray-100 dark:bg-gray-800 shadow-soft hover:shadow-soft-lg transition-shadow duration-500"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 text-white">
                    <span className="font-bold text-lg sm:text-xl lg:text-2xl leading-tight">{cat.name}</span>
                    <span className="text-xs sm:text-sm text-white/75 mt-1">{cat.blurb}</span>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white/90 group-hover:gap-2.5 transition-all">
                      {count} {count === 1 ? 'style' : 'styles'} <span aria-hidden>→</span>
                    </span>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
