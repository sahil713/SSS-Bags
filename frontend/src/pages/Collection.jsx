import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import StyleCard from '../components/StyleCard'
import WhatsAppIcon from '../components/ui/WhatsAppIcon'
import { CATEGORIES, STYLES } from '../data/catalog'
import { SHOP, whatsappUrl } from '../constants/shop'

// Static collection page. Replaces pages/Products.jsx (API-driven, with
// pagination and sorting) while the backend is disabled — see App.jsx.
export default function Collection() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const active = params.get('category') || ''
  const activeCategory = CATEGORIES.find((c) => c.slug === active)

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return STYLES.filter((s) => (!active || s.category === active))
      .filter((s) => !q || `${s.name} ${s.description} ${s.occasion} ${s.tag}`.toLowerCase().includes(q))
  }, [active, query])

  const selectCategory = (slug) => {
    if (slug) setParams({ category: slug })
    else setParams({})
  }

  return (
    <div className="w-full">
      <section className="relative bg-black text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 80% 0%, rgba(124,58,237,0.45), transparent 70%)' }}
          aria-hidden
        />
        <div className="relative max-w-content mx-auto px-6 lg:px-12 py-14 lg:py-20">
          <nav className="text-xs text-gray-400 mb-3 uppercase tracking-wide">
            <Link to="/" className="hover:text-white">Home</Link> <span className="mx-1.5">/</span>{' '}
            <span className="text-gray-200">Collection</span>
          </nav>
          <h1 className="text-4xl lg:text-5xl font-bold mb-3">{activeCategory ? activeCategory.name : 'The Collection'}</h1>
          <p className="text-gray-400 max-w-2xl">
            {activeCategory
              ? activeCategory.blurb + '. A few of the styles we carry — the store has many more.'
              : 'A look at the styles you’ll find in store. Like something? Tap “Ask availability” and we’ll reply on WhatsApp with price and colours.'}
          </p>
        </div>
      </section>

      <div className="sticky top-14 sm:top-16 z-30 bg-gray-50/90 dark:bg-black/90 backdrop-blur border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-content mx-auto px-6 lg:px-12 py-3 flex flex-col md:flex-row md:items-center gap-3 md:justify-between">
          <div className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-1 md:pb-0">
            {[{ slug: '', name: 'All' }, ...CATEGORIES].map((c) => (
              <button
                key={c.slug || 'all'}
                type="button"
                onClick={() => selectCategory(c.slug)}
                className={
                  'shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-colors ' +
                  (active === c.slug
                    ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900 dark:border-white'
                    : 'text-gray-600 border-gray-300 hover:border-gray-500 dark:text-gray-300 dark:border-gray-700')
                }
              >
                {c.name}
              </button>
            ))}
          </div>
          <label className="relative md:w-72">
            <span className="sr-only">Search styles</span>
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" d="m21 21-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search: party, office, trolley…"
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </label>
        </div>
      </div>

      <section className="max-w-content mx-auto px-6 lg:px-12 py-10 lg:py-14">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Showing {list.length} {list.length === 1 ? 'style' : 'styles'}
        </p>
        {list.length > 0 ? (
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <AnimatePresence mode="popLayout">
              {list.map((style) => (
                <motion.div
                  key={style.slug}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                >
                  <StyleCard style={style} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Nothing here matches “{query}”.</p>
            <p className="text-gray-500 dark:text-gray-400 mb-6">We probably still have it — just ask.</p>
            <a
              href={whatsappUrl(SHOP.phones[0].value, `Hi ${SHOP.name}! Do you have ${query || 'this'}?`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-6 py-3 rounded-xl"
            >
              <WhatsAppIcon /> Ask on WhatsApp
            </a>
          </div>
        )}

        <div className="mt-16 rounded-3xl bg-gradient-to-br from-primary-700 to-primary-900 text-white p-8 sm:p-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Didn’t see your style?</h2>
            <p className="text-primary-100 max-w-xl">
              This is just a sample. Send us a photo of the bag you want and we’ll check the shelves for you.
            </p>
          </div>
          <a
            href={whatsappUrl(SHOP.phones[0].value, `Hi ${SHOP.name}! I'm looking for a bag like this (attaching photo).`)}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-semibold px-7 py-4 rounded-2xl hover:scale-[1.03] transition-transform"
          >
            <WhatsAppIcon className="w-5 h-5 text-[#25D366]" /> Send a photo
          </a>
        </div>
      </section>
    </div>
  )
}
