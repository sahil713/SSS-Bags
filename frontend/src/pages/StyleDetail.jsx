import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import StyleCard, { enquiryMessage } from '../components/StyleCard'
import WhatsAppIcon from '../components/ui/WhatsAppIcon'
import { STYLES, categoryBySlug, styleBySlug } from '../data/catalog'
import { SHOP, telUrl, whatsappUrl } from '../constants/shop'

// Static style page. Replaces pages/ProductDetail.jsx (API + cart) while the
// backend is disabled — see App.jsx.
export default function StyleDetail() {
  const { slug } = useParams()
  const style = styleBySlug(slug)
  if (!style) return <Navigate to="/products" replace />

  const category = categoryBySlug(style.category)
  const sameCategory = STYLES.filter((s) => s.slug !== style.slug && s.category === style.category)
  const others = STYLES.filter((s) => s.slug !== style.slug && s.category !== style.category)
  const related = [...sameCategory, ...others].slice(0, 4)

  return (
    <div className="w-full">
      <section className="max-w-content mx-auto px-6 lg:px-12 py-10 lg:py-14">
        <nav className="text-xs text-gray-400 dark:text-gray-500 mb-6 uppercase tracking-wide">
          <Link to="/" className="hover:text-gray-700 dark:hover:text-gray-300">Home</Link>
          <span className="mx-1.5">/</span>
          <Link to="/products" className="hover:text-gray-700 dark:hover:text-gray-300">Collection</Link>
          {category && (
            <>
              <span className="mx-1.5">/</span>
              <Link to={`/products?category=${category.slug}`} className="hover:text-gray-700 dark:hover:text-gray-300">
                {category.name}
              </Link>
            </>
          )}
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <motion.div
            key={style.slug}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-900 aspect-[4/5] shadow-soft-lg"
          >
            <img src={style.image.replace('w=900', 'w=1400')} alt={style.name} className="w-full h-full object-cover" />
            <span className="absolute bottom-4 left-4 bg-black/60 backdrop-blur text-white text-xs px-3 py-1.5 rounded-full">
              Representative photo · colours vary in store
            </span>
          </motion.div>

          <motion.div
            key={style.slug + '-info'}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="lg:sticky lg:top-24"
          >
            <div className="flex flex-wrap gap-2 mb-4">
              {category && (
                <span className="text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400">
                  {category.name}
                </span>
              )}
              {style.tag && (
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">· {style.tag}</span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {style.name}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{style.description}</p>

            <dl className="grid grid-cols-2 gap-4 mb-8 text-sm">
              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
                <dt className="text-gray-500 dark:text-gray-400 mb-1">Best for</dt>
                <dd className="font-semibold text-gray-900 dark:text-white">{style.occasion}</dd>
              </div>
              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
                <dt className="text-gray-500 dark:text-gray-400 mb-1">Price</dt>
                <dd className="font-semibold text-gray-900 dark:text-white">Ask in store / WhatsApp</dd>
              </div>
            </dl>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <a
                href={whatsappUrl(SHOP.phones[0].value, enquiryMessage(style))}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold px-6 py-4 rounded-2xl hover:brightness-110 transition shadow-lg"
              >
                <WhatsAppIcon className="w-5 h-5" />
                Check availability
              </a>
              <a
                href={telUrl(SHOP.phones[0].value)}
                className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-semibold px-6 py-4 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
              >
                📞 Call {SHOP.phones[0].label}
              </a>
            </div>

            <div className="rounded-2xl bg-gray-100 dark:bg-gray-900 p-5 text-sm text-gray-600 dark:text-gray-300">
              <p className="font-semibold text-gray-900 dark:text-white mb-1">Available at the store</p>
              <p>{SHOP.address.full}</p>
              <Link to="/visit-us" className="inline-block mt-2 font-semibold text-primary-600 dark:text-primary-400 hover:underline">
                Map & directions →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-content mx-auto px-6 lg:px-12 pb-20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">You may also like</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {related.map((s) => (
            <StyleCard key={s.slug} style={s} />
          ))}
        </div>
      </section>
    </div>
  )
}
