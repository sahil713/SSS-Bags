import { motion } from 'framer-motion'

const items = [
  { icon: '🚚', title: 'Fast Delivery', desc: 'Quick shipping across India' },
  { icon: '✨', title: 'Premium Quality', desc: 'Curated materials & craftsmanship' },
  { icon: '🔒', title: 'Secure Payment', desc: '100% safe checkout' },
  { icon: '💬', title: '24/7 Support', desc: "We're here when you need us" },
]

export default function WhyChooseUs() {
  return (
    <section className="w-full py-20 lg:py-28 bg-gray-50 dark:bg-gray-800/40">
      <div className="max-w-content mx-auto px-6 lg:px-12">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-14 text-center"
        >
          Why Choose Us
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-center p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-soft-lg hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300"
            >
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
