import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import DustCircle from '../ui/DustCircle'
import { SHOP } from '../../constants/shop'

export default function FinalCTA() {
  return (
    <section className="relative w-full py-28 lg:py-36 bg-black overflow-hidden flex items-center justify-center text-center">
      <DustCircle className="w-[460px] h-[460px] sm:w-[640px] sm:h-[640px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <div className="relative z-10 max-w-2xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-6"
        >
          Come see it
          <br />
          for yourself.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-gray-400 text-lg mb-10"
        >
          Open daily near Double Phatak, Dhuri. No appointment needed.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.18 }}
        >
          <Link
            to="/visit-us"
            className="inline-block bg-white text-gray-900 font-semibold px-9 py-4 rounded-2xl hover:bg-primary-50 transition-all duration-300 shadow-2xl hover:scale-105"
          >
            Get Directions
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
