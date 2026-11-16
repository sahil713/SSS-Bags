import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SHOP, whatsappUrl } from '../../constants/shop'
import { ATMOSPHERE } from '../../data/catalog'

const steps = [
  {
    n: '01',
    title: 'Browse styles here',
    body: 'Look through the collection to get a feel for what we carry and save the ones you like.',
    cta: { label: 'Open collection', to: '/products' },
  },
  {
    n: '02',
    title: 'Ask on WhatsApp',
    body: 'Send us the style name or any photo. We’ll confirm stock, colours and price.',
    cta: { label: 'Message us', href: whatsappUrl(SHOP.phones[0].value) },
  },
  {
    n: '03',
    title: 'Pick it up in Dhuri',
    body: `Drop by our store ${SHOP.address.line1.replace('Near', 'near')}, Dhuri — we can keep it aside for you.`,
    cta: { label: 'Get directions', to: '/visit-us' },
  },
]

export default function HowItWorks() {
  return (
    <section className="relative w-full py-20 lg:py-28 bg-black text-white overflow-hidden">
      <div className="max-w-content mx-auto px-6 lg:px-12 grid lg:grid-cols-[1.1fr_1fr] gap-14 lg:gap-20 items-center">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-amber-400/90 text-xs font-semibold tracking-[0.3em] uppercase mb-4"
          >
            How it works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06 }}
            className="font-serif text-4xl sm:text-5xl leading-tight mb-12"
          >
            From your phone
            <br />
            to your shoulder.
          </motion.h2>
          <ol className="space-y-8">
            {steps.map((s, i) => (
              <motion.li
                key={s.n}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex gap-6"
              >
                <span className="font-serif text-3xl text-amber-400/80 tabular-nums w-12 shrink-0">{s.n}</span>
                <div className="border-l border-white/10 pl-6">
                  <h3 className="text-xl font-semibold mb-1.5">{s.title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-3">{s.body}</p>
                  {s.cta.to ? (
                    <Link to={s.cta.to} className="text-sm font-semibold text-white/90 hover:text-amber-300 transition-colors">
                      {s.cta.label} →
                    </Link>
                  ) : (
                    <a
                      href={s.cta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-white/90 hover:text-amber-300 transition-colors"
                    >
                      {s.cta.label} →
                    </a>
                  )}
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="relative h-[420px] sm:h-[520px]"
          aria-hidden
        >
          <div className="absolute top-0 right-0 w-[68%] h-[72%] rounded-2xl overflow-hidden shadow-2xl rotate-3">
            <img src={ATMOSPHERE.gallery[0]} alt="" loading="lazy" className="w-full h-full object-cover" />
          </div>
          <div className="absolute bottom-0 left-0 w-[58%] h-[60%] rounded-2xl overflow-hidden shadow-2xl -rotate-3 border-4 border-black">
            <img src={ATMOSPHERE.gallery[1]} alt="" loading="lazy" className="w-full h-full object-cover" />
          </div>
          <div className="absolute bottom-10 right-4 sm:right-10 bg-white text-gray-900 rounded-2xl shadow-2xl px-4 py-3 max-w-[220px]">
            <p className="text-xs text-gray-500 mb-1">WhatsApp · {SHOP.name}</p>
            <p className="text-sm font-medium">Yes, we have it in black and tan! Come by anytime 👜</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
