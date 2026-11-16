import { motion } from 'framer-motion'
import { SHOP, whatsappUrl } from '../../constants/shop'
import { ATMOSPHERE } from '../../data/catalog'
import WhatsAppIcon from '../ui/WhatsAppIcon'

// Previously advertised "Festival Sale – Up To 40% Off / code FEST40", which
// needed online checkout. Put a real in-store offer here when there is one.
export default function PromoBanner() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative w-full min-h-[440px] lg:min-h-[500px] flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-black">
        <img src={ATMOSPHERE.promo} alt="" loading="lazy" className="w-full h-full object-cover opacity-40" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/30" />
      </div>
      <div className="relative z-10 w-full max-w-content mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary-300 text-sm font-semibold uppercase tracking-widest mb-4"
          >
            Saw a bag you love?
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5 tracking-tight leading-[1.05]"
          >
            Send us a photo.
            <br />
            <span className="text-primary-300">We&apos;ll find it for you.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-300 mb-9 max-w-xl"
          >
            Spotted a design on Instagram or at a wedding? WhatsApp us the picture and we&apos;ll tell you if we have
            it — or the closest match — with price, before you make the trip.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <a
              href={whatsappUrl(SHOP.phones[0].value, `Hi ${SHOP.name}! Do you have a bag like this? (attaching photo)`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-7 py-4 rounded-2xl hover:brightness-110 transition shadow-xl"
            >
              <WhatsAppIcon className="w-5 h-5" />
              Send a photo
            </a>
            <a
              href={SHOP.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border-2 border-white/40 text-white font-semibold px-7 py-4 rounded-2xl hover:bg-white/10 transition-colors"
            >
              See new arrivals on Instagram
            </a>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
