import { Link } from 'react-router-dom'
import { SHOP, whatsappUrl } from '../constants/shop'
import { categoryBySlug } from '../data/catalog'
import WhatsAppIcon from './ui/WhatsAppIcon'

export function enquiryMessage(style) {
  return `Hi ${SHOP.name}! I saw the "${style.name}" on your website. Is this (or something similar) available? Please share price and colours.`
}

export default function StyleCard({ style }) {
  const category = categoryBySlug(style.category)

  return (
    <div className="group relative flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-[transform,box-shadow] duration-300">
      <Link to={`/products/${style.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={style.image}
          alt={style.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {style.tag && (
          <span className="absolute top-3 left-3 bg-white/90 dark:bg-black/70 backdrop-blur text-gray-900 dark:text-white text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">
            {style.tag}
          </span>
        )}
      </Link>
      <div className="flex flex-col flex-1 p-4">
        {category && (
          <p className="text-[11px] uppercase tracking-widest text-primary-600 dark:text-primary-400 font-semibold mb-1">
            {category.name}
          </p>
        )}
        <Link to={`/products/${style.slug}`} className="font-semibold text-gray-900 dark:text-white leading-snug hover:underline">
          {style.name}
        </Link>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">Price in store · ask on WhatsApp</p>
        <a
          href={whatsappUrl(SHOP.phones[0].value, enquiryMessage(style))}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center justify-center gap-2 w-full rounded-xl border border-gray-200 dark:border-gray-700 py-2.5 text-sm font-semibold text-gray-800 dark:text-gray-100 hover:bg-[#25D366] hover:border-[#25D366] hover:text-white transition-colors"
        >
          <WhatsAppIcon className="w-4 h-4" />
          Ask availability
        </a>
      </div>
    </div>
  )
}
