import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const placeholderImage = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80'

export default function FeaturedCategories({ categories = [] }) {
  const items = categories.length >= 4
    ? categories.slice(0, 4).map((c) => ({ slug: c.slug, name: c.name, image: c.image_url || placeholderImage }))
    : [
        { slug: 'backpacks', name: 'Backpacks', image: placeholderImage },
        { slug: 'totes', name: 'Totes', image: placeholderImage },
        { slug: 'luggage', name: 'Luggage', image: placeholderImage },
        { slug: 'accessories', name: 'Accessories', image: placeholderImage },
      ]

  return (
    <section className="w-full py-20 lg:py-28">
      <div className="max-w-content mx-auto px-6 lg:px-12">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center"
        >
          Shop by Category
        </motion.h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {items.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                to={cat.slug ? '/products?category=' + cat.slug : '/products'}
                className="block group relative rounded-2xl overflow-hidden aspect-[4/5] lg:aspect-[3/4] bg-gray-100 dark:bg-gray-800 shadow-soft hover:shadow-soft-lg transition-all duration-500"
              >
                <img
                  src={cat.image || placeholderImage}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <span className="font-bold text-xl lg:text-2xl group-hover:translate-y-0 translate-y-0 transition-transform duration-300">
                    {cat.name}
                  </span>
                  <span className="text-sm text-white/90 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Shop now →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
