import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SHOP, whatsappUrl } from '../../constants/shop'

const faqs = [
  {
    q: 'Can I order online?',
    a: `Not yet — online ordering is coming soon. For now, browse the styles here, message us on WhatsApp to check stock and price, and pick up from the store in Dhuri.`,
  },
  {
    q: 'Where exactly is the shop?',
    a: `${SHOP.address.full}. Tap "Visit Us" for a map and one-tap directions.`,
  },
  {
    q: 'What are your timings?',
    a: `${SHOP.hours.label}. Walk in anytime — no appointment needed.`,
  },
  {
    q: 'Are the bags on the website exactly what’s in stock?',
    a: 'The photos show the kind of styles we carry. Stock changes often and the shop has many more designs than we can show here, so WhatsApp us a photo of what you want and we’ll confirm.',
  },
  {
    q: 'Do you have trolley bags and attachi for travel?',
    a: 'Yes — we keep a full travel range, from cabin-size trolleys to large check-in sizes and classic attachi.',
  },
  {
    q: 'Can you keep a bag aside for me?',
    a: 'Message us on WhatsApp with the design you liked and when you plan to come in, and we’ll do our best to hold it.',
  },
]

function Item({ faq, open, onToggle, id }) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-800">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={id}
          className="w-full flex items-center justify-between gap-6 py-5 text-left font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-300 transition-colors"
        >
          {faq.q}
          <span
            className={'shrink-0 w-8 h-8 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center transition-transform duration-300 ' + (open ? 'rotate-45' : '')}
            aria-hidden
          >
            +
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="pb-5 pr-12 text-gray-600 dark:text-gray-400 leading-relaxed">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQSection() {
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="w-full py-20 lg:py-28 bg-white dark:bg-gray-950 scroll-mt-20">
      <div className="max-w-content mx-auto px-6 lg:px-12 grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20">
        <div>
          <p className="text-primary-600 dark:text-primary-400 text-xs font-semibold tracking-[0.25em] uppercase mb-3">FAQs</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-5">Good to know before you visit</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Still have a question? We usually reply quickly on WhatsApp.</p>
          <a
            href={whatsappUrl(SHOP.phones[0].value)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold px-6 py-3 rounded-xl hover:scale-[1.03] transition-transform"
          >
            Ask us anything
          </a>
        </div>
        <div>
          {faqs.map((faq, i) => (
            <Item key={faq.q} id={`faq-${i}`} faq={faq} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
          ))}
        </div>
      </div>
    </section>
  )
}
