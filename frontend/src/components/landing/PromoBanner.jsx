import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const bgImage = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1600&q=80'

export default function PromoBanner() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative w-full min-h-[420px] lg:min-h-[480px] flex items-center justify-center overflow-hidden rounded-none"
    >
      <div className="absolute inset-0">
        <img src={bgImage} alt="" className="w-full h-full object-cover" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 via-primary-800/75 to-primary-700/60 dark:from-black/85 dark:via-primary-950/80 dark:to-primary-900/70" />
      </div>
      <div className="relative z-10 max-w-content mx-auto px-6 lg:px-12 py-16 lg:py-24 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-primary-200 dark:text-primary-300 text-sm font-semibold uppercase tracking-widest mb-4"
        >
          Limited Time
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 tracking-tight"
        >
          Festival Sale – Up To 40% Off
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-primary-100 dark:text-primary-200 mb-10 max-w-2xl mx-auto"
        >
          Premium bags & luggage. Use code FEST40 at checkout.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Link
            to="/products"
            className="inline-block bg-white text-primary-700 font-semibold px-8 py-4 rounded-2xl hover:bg-primary-50 transition-all shadow-xl hover:scale-105"
          >
            Shop the Sale
          </Link>
        </motion.div>
      </div>
    </motion.section>
  )
}
