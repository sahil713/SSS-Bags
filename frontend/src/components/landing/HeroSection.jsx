import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const heroImage = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&q=85'

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[85vh] lg:min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 dark:from-primary-900 dark:via-primary-950 dark:to-gray-900 text-white">
      <div className="absolute inset-0">
        <img src={heroImage} alt="" className="w-full h-full object-cover opacity-30" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 via-primary-800/80 to-transparent dark:from-black/90 dark:via-primary-950/90" />
      </div>
      <div className="relative w-full max-w-content mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="text-primary-200 dark:text-primary-300 text-lg font-medium mb-4 tracking-wide uppercase"
            >
              Premium Bags & Luggage
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: 'easeOut' }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
            >
              Bags for Every Journey
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16, ease: 'easeOut' }}
              className="text-lg md:text-xl text-primary-100 dark:text-primary-200 mb-10 max-w-xl leading-relaxed"
            >
              Handpicked backpacks, totes & luggage. Quality that travels with you.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24, ease: 'easeOut' }}
              className="flex flex-wrap gap-4"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/products"
                  className="inline-block bg-white text-primary-700 font-semibold px-8 py-4 rounded-2xl hover:bg-primary-50 transition-colors shadow-xl"
                >
                  Shop Now
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/products"
                  className="inline-block border-2 border-white text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/15 transition-colors"
                >
                  Explore Collection
                </Link>
              </motion.div>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] max-h-[600px]">
              <img
                src={heroImage}
                alt="Premium bags collection"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/40 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
