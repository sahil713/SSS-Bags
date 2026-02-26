import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import DiscountTimer from './DiscountTimer'

const AUTO_ADVANCE_MS = 5000

const DEFAULT_BANNERS = [
  {
    id: 'default-1',
    title: 'Diwali Sale - Flat 30% OFF',
    subtitle: 'On Premium Bags & Luggage',
    description: 'Limited period offer. Use code DIWALI30 at checkout.',
    button_text: 'Shop Now',
    button_link: '/products',
    background_color: '#5B21B6',
    text_color: '#ffffff',
  },
  {
    id: 'default-2',
    title: 'Buy 2 Get 1 Free',
    subtitle: 'On Selected Collections',
    description: 'Mix and match. Add 3 items and get the lowest priced one free.',
    button_text: 'Explore Collection',
    button_link: '/products',
    background_color: '#6D28D9',
    text_color: '#ffffff',
  },
  {
    id: 'default-3',
    title: 'Festival Collection Live Now',
    subtitle: 'New Arrivals',
    description: 'Handpicked bags for the festive season.',
    button_text: 'Shop Now',
    button_link: '/products',
    background_color: '#4C1D95',
    text_color: '#ffffff',
  },
]

export default function BannerCarousel({ banners = [], className = '' }) {
  const [index, setIndex] = useState(0)
  const list = banners.length > 0 ? banners : DEFAULT_BANNERS

  useEffect(() => {
    if (list.length <= 1) return
    const id = setInterval(() => setIndex((i) => (i + 1) % list.length), AUTO_ADVANCE_MS)
    return () => clearInterval(id)
  }, [list.length])

  if (!list.length) return null

  const b = list[index]
  const bgStyle = {
    backgroundColor: b.background_color || undefined,
    color: b.text_color || undefined,
  }

  return (
    <div className={'relative w-full ' + className}>
      <AnimatePresence mode="wait">
        <motion.div
          key={b.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="relative w-full h-[400px] flex items-center justify-center text-center bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 dark:from-primary-900 dark:to-primary-950 bg-cover bg-center"
          style={bgStyle}
        >
          {b.image_url && (
            <>
              <img
                src={b.image_url}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-900/85 via-primary-800/70 to-transparent dark:from-black/75" />
            </>
          )}
          <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-12 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-2" style={{ color: b.text_color || undefined }}>
              {b.title}
            </h2>
            {b.subtitle && (
              <p className="text-lg md:text-2xl opacity-95 mb-4" style={{ color: b.text_color ? `${b.text_color}dd` : undefined }}>
                {b.subtitle}
              </p>
            )}
            {b.description && (
              <p className="text-sm md:text-base opacity-90 mb-6 max-w-2xl mx-auto" style={{ color: b.text_color ? `${b.text_color}cc` : undefined }}>
                {b.description}
              </p>
            )}
            {b.end_date && (
              <div className="mb-4">
                <DiscountTimer endDate={b.end_date} label="Offer ends in" />
              </div>
            )}
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to={b.button_link && b.button_link.startsWith('/') ? b.button_link : '/products'}
                className="inline-block bg-white text-primary-700 font-semibold px-6 py-3 rounded-lg hover:bg-primary-100 transition-all duration-200 hover:scale-105 shadow-lg"
              >
                {b.button_text || 'Shop Now'}
              </Link>
              <Link
                to="/products"
                className="inline-block border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/20 transition-all duration-200"
              >
                Explore Collection
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      {list.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {list.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={'w-2.5 h-2.5 rounded-full transition-all ' + (i === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80')}
              aria-label={'Slide ' + (i + 1)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
