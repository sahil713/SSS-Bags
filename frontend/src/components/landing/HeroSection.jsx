import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SHOP } from '../../constants/shop'

const posterImage = SHOP.photos[0].src

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[92vh] flex items-center overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <video
          className="w-full h-full object-cover opacity-60"
          src="/videos/hero-bg.mp4"
          poster={posterImage}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/65 to-black" />
      </div>

      <div className="relative w-full max-w-content mx-auto px-6 lg:px-12 pt-24 pb-16">
        <div className="hidden lg:flex flex-col items-end gap-2 absolute top-8 right-6 lg:right-12 text-right">
          {SHOP.whatWeSell.map((item) => (
            <span key={item.name} className="flex items-center gap-2 text-sm text-gray-300">
              {item.name}
              <span className="w-1 h-1 rounded-full bg-primary-400" />
            </span>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-primary-300 text-sm font-semibold tracking-[0.25em] uppercase mb-6"
        >
          Premium Bags & Luggage
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="text-6xl sm:text-8xl lg:text-9xl font-extrabold tracking-tight leading-[0.92] mb-10"
        >
          Bags for
          <br />
          every journey.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="flex flex-wrap items-center gap-4 mb-8"
        >
          <div className="relative inline-block">
            <span className="absolute inset-0 rounded-2xl bg-primary-500/50 blur-xl animate-pulse" aria-hidden />
            <Link
              to="/products"
              className="relative inline-block bg-white text-gray-900 font-semibold px-9 py-4 rounded-2xl hover:bg-primary-50 transition-all duration-300 shadow-2xl hover:scale-105"
            >
              Shop Now
            </Link>
          </div>
          <Link
            to="/products"
            className="inline-block border-2 border-white/40 text-white font-semibold px-9 py-4 rounded-2xl hover:bg-white/10 transition-colors"
          >
            Explore Collection
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
