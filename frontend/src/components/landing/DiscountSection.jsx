import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const leftBg = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80'
const rightBg = 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80'

function BannerCard({ to, title, subtitle, cta, image, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      <Link to={to || '/products'} className="block group relative rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-auto lg:min-h-[280px] shadow-lg hover:shadow-xl transition-all duration-300">
        <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-primary-900/85 via-primary-800/50 to-transparent dark:from-black/80" />
        <div className="absolute inset-0 flex flex-col justify-end lg:justify-center p-6 lg:p-10 text-white">
          <h3 className="text-2xl lg:text-3xl font-bold mb-1">{title}</h3>
          {subtitle && <p className="text-primary-100 dark:text-primary-200 mb-4">{subtitle}</p>}
          <span className="inline-flex items-center font-semibold text-sm gap-2 group-hover:gap-3 transition-all">
            {cta}
            <span>→</span>
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

export default function DiscountSection() {
  return (
    <section className="w-full py-20 lg:py-28">
      <div className="max-w-content mx-auto px-6 lg:px-12">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center"
        >
          Don&apos;t Miss Out
        </motion.h2>
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <BannerCard
              to="/products"
              title="Diwali Sale"
              subtitle="Up to 30% off on selected styles"
              cta="Shop Now"
              image={leftBg}
              delay={0}
            />
          </div>
          <div className="flex flex-col gap-6 lg:gap-8">
            <BannerCard
              to="/products"
              title="Buy 2 Get 1 Free"
              subtitle="On selected collections"
              cta="Explore"
              image={rightBg}
              delay={0.1}
            />
            <BannerCard
              to="/products"
              title="New Arrivals"
              subtitle="Fresh styles just landed"
              cta="View All"
              image={rightBg}
              delay={0.2}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
