import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import Logo from './ui/Logo'
import WhatsAppIcon from './ui/WhatsAppIcon'
import { SHOP, whatsappUrl } from '../constants/shop'

/*
 * BACKEND DISABLED — the account, cart and admin controls below need the API.
 * Restore them (and these imports) when the backend is live; see App.jsx.
 *
 * import { useNavigate } from 'react-router-dom'
 * import { useDispatch, useSelector } from 'react-redux'
 * import { useAuth } from '../hooks/useAuth'
 * import { logout } from '../store/slices/authSlice'
 * import CartDrawer from './common/CartDrawer'
 * import AccountDropdown from './common/AccountDropdown'
 *
 * const { isAuthenticated, user, isAdmin } = useAuth()
 * const dispatch = useDispatch()
 * const navigate = useNavigate()
 * const cartCount = useSelector((s) => s.cart.totalItems) || 0
 * const [cartOpen, setCartOpen] = useState(false)
 *
 * {isAuthenticated ? (
 *   isAdmin ? (
 *     <>
 *       <Link to="/admin">Dashboard</Link>
 *       <Link to="/admin/products">Products</Link>
 *       <Link to="/admin/orders">Orders</Link>
 *       <Link to="/admin/users">Users</Link>
 *       <button onClick={() => { dispatch(logout()); navigate('/') }}>Logout</button>
 *     </>
 *   ) : (
 *     <>
 *       <button onClick={() => setCartOpen(true)} aria-label="Cart">…cart icon + {cartCount} badge…</button>
 *       <AccountDropdown key={user?.avatar_url || user?.id} user={user} />
 *     </>
 *   )
 * ) : (
 *   <>
 *     <Link to="/login">Login</Link>
 *     <Link to="/signup">Sign up</Link>
 *   </>
 * )}
 * <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
 */

const LINKS = [
  { to: '/products', label: 'Collection' },
  { to: '/visit-us', label: 'Visit Us' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkClass = ({ isActive }) =>
    'relative whitespace-nowrap text-sm sm:text-base font-medium px-2 sm:px-3 py-2 rounded-lg transition-colors hover:bg-white/10 ' +
    'after:absolute after:left-3 after:right-3 after:bottom-1 after:h-px after:bg-white after:transition-transform after:duration-300 after:origin-left ' +
    (isActive ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100')

  return (
    <nav
      className={
        'sticky top-0 z-50 text-white transition-all duration-300 border-b ' +
        (scrolled ? 'bg-black/80 backdrop-blur-md border-white/10 shadow-lg' : 'bg-black/40 backdrop-blur-md border-white/5')
      }
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Logo className="text-white hover:text-white shrink-0" />
          <div className="flex items-center gap-1 sm:gap-3">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
            <a
              href={whatsappUrl(SHOP.phones[0].value)}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-primary-50 font-semibold px-3 sm:px-4 py-2 rounded-xl transition-colors shadow"
              aria-label="Chat on WhatsApp"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
