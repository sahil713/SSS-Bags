import { Link } from 'react-router-dom'
import Logo from '../ui/Logo'
import { SHOP, whatsappUrl, telUrl } from '../../constants/shop'

const links = [
  { to: '/products', label: 'Browse Collection' },
  { to: '/visit-us', label: 'Visit Our Store' },
  { to: '/#faq', label: 'FAQs' },
  // BACKEND DISABLED — restore when accounts and orders are live (see App.jsx).
  // { to: '/cart', label: 'Cart' },
  // { to: '/profile', label: 'Account' },
  // { to: '/my-orders', label: 'My Orders' },
]

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 dark:bg-black text-gray-300 mt-auto">
      <div className="max-w-content mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          <div className="lg:col-span-2">
            <Logo className="text-white hover:text-white mb-6" />
            <p className="text-base text-gray-400 max-w-md leading-relaxed">
              {SHOP.tagline}. Hundreds of designs in store at Dhuri — come browse, or ask us on WhatsApp.
            </p>
            <address className="not-italic mt-6 text-sm text-gray-400 space-y-1">
              <p>{SHOP.address.line1}</p>
              <p>{SHOP.address.line2}</p>
            </address>
            <div className="mt-4 flex flex-wrap gap-3">
              {SHOP.phones.map((p) => (
                <a
                  key={p.value}
                  href={telUrl(p.value)}
                  className="text-sm font-medium text-primary-300 hover:text-white transition-colors"
                >
                  📞 {p.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-white text-lg mb-4">Quick links</h3>
            <ul className="space-y-3">
              {links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-gray-400 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white text-lg mb-4">What we sell</h3>
            <ul className="space-y-3 mb-6">
              {SHOP.whatWeSell.map((item) => (
                <li key={item.name} className="text-gray-400 text-sm">
                  {item.name}
                </li>
              ))}
            </ul>
            <h3 className="font-bold text-white text-lg mb-4">Follow us</h3>
            <div className="flex gap-4">
              <a
                href={SHOP.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors text-xl"
                aria-label="Instagram"
              >
                📷
              </a>
              <a
                href={whatsappUrl(SHOP.phones[0].value)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors text-xl"
                aria-label="WhatsApp"
              >
                💬
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} SSS BAGS. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
