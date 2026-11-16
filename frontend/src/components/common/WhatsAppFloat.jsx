import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SHOP, whatsappUrl } from '../../constants/shop'
import WhatsAppIcon from '../ui/WhatsAppIcon'

const HINT_KEY = 'sss-bags-wa-hint-seen'

export default function WhatsAppFloat() {
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    let seen = false
    try {
      seen = sessionStorage.getItem(HINT_KEY) === '1'
    } catch {
      /* storage unavailable — just show the hint */
    }
    if (seen) return undefined
    const show = setTimeout(() => setShowHint(true), 6000)
    const hide = setTimeout(() => setShowHint(false), 14000)
    return () => {
      clearTimeout(show)
      clearTimeout(hide)
    }
  }, [])

  const dismissHint = () => {
    setShowHint(false)
    try {
      sessionStorage.setItem(HINT_KEY, '1')
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[70] flex items-end gap-3">
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.25 }}
            className="hidden sm:block max-w-[230px] rounded-2xl bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 text-sm shadow-2xl border border-gray-200 dark:border-gray-700 px-4 py-3 relative"
          >
            <button
              type="button"
              onClick={dismissHint}
              className="absolute top-1 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              aria-label="Dismiss"
            >
              ×
            </button>
            <p className="font-semibold mb-0.5">Looking for a design?</p>
            <p className="text-gray-500 dark:text-gray-400">Send us a photo on WhatsApp — we&apos;ll tell you if it&apos;s in stock.</p>
          </motion.div>
        )}
      </AnimatePresence>
      <a
        href={whatsappUrl(SHOP.phones[0].value, `Hi ${SHOP.name}! I'd like to know about your bags.`)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={dismissHint}
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_8px_30px_rgba(37,211,102,0.45)] hover:scale-105 active:scale-95 transition-transform"
        aria-label="Chat with us on WhatsApp"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" aria-hidden />
        <WhatsAppIcon className="relative w-7 h-7" />
      </a>
    </div>
  )
}
