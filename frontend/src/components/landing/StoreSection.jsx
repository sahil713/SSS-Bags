import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SHOP, whatsappUrl, telUrl } from '../../constants/shop'
import OpenStatus from '../ui/OpenStatus'

export default function StoreSection() {
  return (
    <section className="w-full py-20 lg:py-28 bg-white dark:bg-black">
      <div className="max-w-content mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="text-primary-600 dark:text-primary-400 text-sm font-semibold tracking-widest uppercase mb-3">
            Now Open
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Visit Our Store
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Step into {SHOP.name} to browse hundreds of handbags, purses & clutches, and our
            full range of attachi and trolley bags — in person.
          </p>
          <div className="space-y-3 mb-8">
            <p className="text-gray-900 dark:text-white font-semibold">{SHOP.address.line1}</p>
            <p className="text-gray-500 dark:text-gray-400">{SHOP.address.line2}</p>
            <p className="text-gray-700 dark:text-gray-300 pt-2">{SHOP.hours.label}</p>
            <OpenStatus className="text-sm font-medium text-gray-600 dark:text-gray-300" />
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/visit-us"
              className="inline-block bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold px-6 py-3.5 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl"
            >
              Get Directions
            </Link>
            <a
              href={whatsappUrl(SHOP.phones[0].value)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border-2 border-gray-300 dark:border-white/30 text-gray-700 dark:text-white font-semibold px-6 py-3.5 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              WhatsApp Us
            </a>
            <a
              href={telUrl(SHOP.phones[0].value)}
              className="inline-flex items-center text-gray-700 dark:text-gray-300 font-medium px-2 py-3.5 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {SHOP.phones.map((p) => p.label).join(' | ')}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
