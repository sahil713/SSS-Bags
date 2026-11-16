import { motion } from 'framer-motion'
import { SHOP } from '../../constants/shop'

const EDGE = 'clamp(85px, 24vw, 160px)'
const CORNER = 'clamp(70px, 20vw, 130px)'

const tiles = [
  { key: 'tl', z: 10, image: SHOP.photos[0].src, style: { transform: `rotateX(14deg) rotateY(20deg) translateZ(-60px) translate(calc(${CORNER} * -1), calc(${CORNER} * -1))` } },
  { key: 'tc', z: 20, label: 'Handbags', emoji: '👜', style: { transform: `rotateX(20deg) translateZ(-30px) translateY(calc(${EDGE} * -1))` } },
  { key: 'tr', z: 10, image: SHOP.photos[1].src, style: { transform: `rotateX(14deg) rotateY(-20deg) translateZ(-60px) translate(${CORNER}, calc(${CORNER} * -1))` } },
  { key: 'ml', z: 20, label: 'Purses & Clutches', emoji: '👛', style: { transform: `rotateY(22deg) translateZ(-30px) translateX(calc(${EDGE} * -1))` } },
  { key: 'mc', z: 30, text: true, style: { transform: 'translateZ(70px)' } },
  { key: 'mr', z: 20, label: 'Attachi & Trolley', emoji: '🧳', style: { transform: `rotateY(-22deg) translateZ(-30px) translateX(${EDGE})` } },
  { key: 'bl', z: 10, instagram: true, style: { transform: `rotateX(-14deg) rotateY(20deg) translateZ(-60px) translate(calc(${CORNER} * -1), ${CORNER})` } },
  { key: 'bc', z: 20, image: SHOP.photos[0].src, style: { transform: `rotateX(-20deg) translateZ(-30px) translateY(${EDGE})` } },
  { key: 'br', z: 10, image: SHOP.photos[1].src, style: { transform: `rotateX(-14deg) rotateY(-20deg) translateZ(-60px) translate(${CORNER}, ${CORNER})` } },
]

function Tile({ tile }) {
  const base = 'absolute w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-lg sm:rounded-xl overflow-hidden shadow-2xl border border-white/10 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2'
  const style = { ...tile.style, zIndex: tile.z }

  if (tile.text) {
    return (
      <div className={base + ' bg-black flex flex-col items-center justify-center text-center p-2'} style={style}>
        <span className="text-white font-bold text-sm sm:text-lg leading-tight">SSS BAGS</span>
        <span className="text-gray-400 text-[9px] sm:text-xs mt-1">Dhuri, Punjab</span>
      </div>
    )
  }
  if (tile.instagram) {
    return (
      <div className={base + ' bg-gradient-to-br from-primary-600 to-primary-800 flex flex-col items-center justify-center text-center p-2'} style={style}>
        <span className="text-xl sm:text-2xl">📷</span>
        <span className="text-white text-[9px] sm:text-xs font-semibold mt-1">Follow Us</span>
      </div>
    )
  }
  if (tile.image) {
    return (
      <div className={base} style={style}>
        <img src={tile.image} alt="" className="w-full h-full object-cover" aria-hidden />
        <div className="absolute inset-0 bg-black/20" />
      </div>
    )
  }
  return (
    <div className={base + ' bg-gray-900 flex flex-col items-center justify-center text-center p-2'} style={style}>
      <span className="text-xl sm:text-2xl mb-1">{tile.emoji}</span>
      <span className="text-white text-[9px] sm:text-xs font-semibold leading-tight">{tile.label}</span>
    </div>
  )
}

export default function PerspectiveGallery() {
  return (
    <section className="relative w-full py-20 lg:py-28 bg-black overflow-hidden">
      <div className="max-w-content mx-auto px-6 lg:px-12 text-center mb-16 sm:mb-20">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-primary-300 text-sm font-semibold tracking-widest uppercase mb-3"
        >
          Inside SSS Bags
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.06 }}
          className="text-3xl sm:text-4xl font-bold text-white"
        >
          Real bags. Real store.
        </motion.h2>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
        className="relative mx-auto h-[360px] sm:h-[480px] lg:h-[560px]"
        style={{ perspective: '1400px' }}
      >
        <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
          {tiles.map((tile) => (
            <Tile key={tile.key} tile={tile} />
          ))}
        </div>
      </motion.div>
    </section>
  )
}
