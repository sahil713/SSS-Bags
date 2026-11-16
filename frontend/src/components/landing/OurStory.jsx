import { motion } from 'framer-motion'
import { SHOP } from '../../constants/shop'

const blocks = [
  {
    key: 'visit',
    eyebrow: 'Why Visit Us',
    heading: 'Come browse, no rush.',
    body: `Hundreds of handbag designs line the shelves at ${SHOP.name} — the kind of selection that's easier to take in walking the aisles than scrolling a screen. Come in, take your time, and try a few on.`,
    image: SHOP.photos[0].src,
    alt: SHOP.photos[0].alt,
    reverse: false,
  },
  {
    key: 'find',
    eyebrow: 'What You’ll Find',
    heading: 'Handbags, purses, and travel bags — all in one place.',
    body: 'From everyday handbags to party clutches, and a full range of attachi and trolley bags for your next trip, it’s all stocked under one roof in Dhuri.',
    image: SHOP.photos[1].src,
    alt: SHOP.photos[1].alt,
    reverse: true,
  },
]

function StoryBlock({ block, index }) {
  return (
    <div className={'grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ' + (index > 0 ? 'mt-20 lg:mt-28' : '')}>
      <motion.div
        initial={{ opacity: 0, x: block.reverse ? 40 : -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className={block.reverse ? 'lg:order-2' : ''}
      >
        <div className="rounded-sm overflow-hidden aspect-[4/3]">
          <img src={block.image} alt={block.alt} className="w-full h-full object-cover" />
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
        className={block.reverse ? 'lg:order-1' : ''}
      >
        <p className="text-amber-400/90 text-xs font-semibold tracking-[0.25em] uppercase mb-4">
          {block.eyebrow}
        </p>
        <div className="w-12 h-px bg-amber-500/50 mb-6" />
        <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white leading-snug mb-5">
          {block.heading}
        </h3>
        <p className="text-gray-400 leading-relaxed max-w-md">
          {block.body}
        </p>
      </motion.div>
    </div>
  )
}

export default function OurStory() {
  return (
    <section className="relative w-full bg-black py-24 lg:py-32 overflow-hidden">
      <div className="max-w-content mx-auto px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-20 lg:mb-28">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-amber-400/90 text-xs font-semibold tracking-[0.3em] uppercase mb-5"
          >
            Our Story
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white leading-tight"
          >
            Built for browsing,
            <br />
            not for rushing.
          </motion.h2>
        </div>

        {blocks.map((block, i) => (
          <StoryBlock key={block.key} block={block} index={i} />
        ))}
      </div>
    </section>
  )
}
