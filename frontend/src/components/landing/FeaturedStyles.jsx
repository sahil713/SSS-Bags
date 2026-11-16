import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import StyleCard from '../StyleCard'
import { STYLES } from '../../data/catalog'

const OCCASIONS = ['All', 'Everyday', 'Party', 'Work', 'Travel']

// Replaces FeaturedProducts (which fetched from the API) while the backend is off.
export default function FeaturedStyles() {
  const [occasion, setOccasion] = useState('All')
  const list = (occasion === 'All' ? STYLES : STYLES.filter((s) => s.occasion === occasion)).slice(0, 8)

  return (
    <section className="w-full py-20 lg:py-28 bg-white dark:bg-gray-950">
      <div className="max-w-content mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10"
        >
          <div>
            <p className="text-primary-600 dark:text-primary-400 text-xs font-semibold tracking-[0.25em] uppercase mb-3">
              Styles in store
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">Find your bag by occasion</h2>
          </div>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by occasion">
            {OCCASIONS.map((o) => (
              <button
                key={o}
                type="button"
                role="tab"
                aria-selected={occasion === o}
                onClick={() => setOccasion(o)}
                className={
                  'px-4 py-2 rounded-full text-sm font-semibold border transition-colors ' +
                  (occasion === o
                    ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900 dark:border-white'
                    : 'bg-transparent text-gray-600 border-gray-300 hover:border-gray-500 dark:text-gray-300 dark:border-gray-700 dark:hover:border-gray-500')
                }
              >
                {o}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div layout className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {list.map((style) => (
              <motion.div
                key={style.slug}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
              >
                <StyleCard style={style} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <Link
            to="/products"
            className="inline-block bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold px-8 py-3.5 rounded-2xl hover:scale-[1.03] transition-transform shadow-xl"
          >
            See the full collection
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
            Photos show styles we carry. Designs change often — the shop has many more.
          </p>
        </div>
      </div>
    </section>
  )
}
