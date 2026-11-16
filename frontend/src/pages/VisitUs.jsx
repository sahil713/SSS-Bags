import { motion } from 'framer-motion'
import { SHOP, whatsappUrl, telUrl } from '../constants/shop'

export default function VisitUs() {
  return (
    <div className="w-full">
      <section className="relative w-full min-h-[45vh] flex items-center overflow-hidden bg-black text-white">
        <img
          src={SHOP.photos[1].src}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/70 to-black" />
        <div className="relative max-w-content mx-auto px-6 lg:px-12 py-20 w-full">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-primary-300 text-sm font-semibold tracking-widest uppercase mb-3"
          >
            Now Open
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.06 }}
            className="text-4xl sm:text-5xl font-bold mb-4"
          >
            Visit {SHOP.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="text-lg text-primary-100 max-w-xl"
          >
            {SHOP.tagline}
          </motion.p>
        </div>
      </section>

      <section className="max-w-content mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Store details</h2>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-soft p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Address
                </h3>
                <p className="text-gray-900 dark:text-white font-medium">{SHOP.address.line1}</p>
                <p className="text-gray-500 dark:text-gray-400">{SHOP.address.line2}</p>
                <a
                  href={SHOP.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-primary-600 dark:text-primary-400 font-medium hover:underline"
                >
                  Get directions →
                </a>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Call or WhatsApp
                </h3>
                <div className="flex flex-wrap gap-3">
                  {SHOP.phones.map((p) => (
                    <div key={p.value} className="flex gap-2">
                      <a
                        href={telUrl(p.value)}
                        className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        📞 {p.label}
                      </a>
                      <a
                        href={whatsappUrl(p.value)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                      >
                        💬 WhatsApp
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Follow us
                </h3>
                <a
                  href={SHOP.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
                >
                  📷 {SHOP.instagram.handle}
                </a>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                  What we sell
                </h3>
                <ul className="space-y-2">
                  {SHOP.whatWeSell.map((item) => (
                    <li key={item.name} className="flex justify-between gap-4 text-sm border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0">
                      <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-right">{item.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <div className="rounded-2xl overflow-hidden shadow-soft-lg h-72 lg:h-80">
              <iframe
                title="SSS Bags location map"
                src={SHOP.mapsEmbedUrl}
                className="w-full h-full border-0"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {SHOP.photos.map((photo) => (
                <div key={photo.src} className="rounded-2xl overflow-hidden shadow-soft group">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-full object-cover aspect-square transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
