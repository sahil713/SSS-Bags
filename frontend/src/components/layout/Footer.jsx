import { Link } from 'react-router-dom'
import Logo from '../ui/Logo'

const links = [
  { to: '/products', label: 'Products' },
  { to: '/cart', label: 'Cart' },
  { to: '/profile', label: 'Account' },
  { to: '/my-orders', label: 'My Orders' },
]

const social = [
  { name: 'Instagram', href: '#', icon: '📷' },
  { name: 'Facebook', href: '#', icon: 'f' },
  { name: 'Twitter', href: '#', icon: '𝕏' },
]

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 dark:bg-gray-950 text-gray-300 mt-auto">
      <div className="max-w-content mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          <div className="lg:col-span-2">
            <Logo className="text-white hover:text-white mb-6" />
            <p className="text-base text-gray-400 max-w-md leading-relaxed">
              Premium bags, backpacks & luggage. Quality that travels with you.
            </p>
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
            <h3 className="font-bold text-white text-lg mb-4">Follow us</h3>
            <div className="flex gap-4">
              {social.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-400 transition-colors text-xl"
                  aria-label={s.name}
                >
                  {s.icon}
                </a>
              ))}
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
