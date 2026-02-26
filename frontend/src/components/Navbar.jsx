import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/slices/authSlice'
import { useTheme } from '../context/ThemeContext'
import Logo from './ui/Logo'
import CartDrawer from './common/CartDrawer'
import AccountDropdown from './common/AccountDropdown'

export default function Navbar() {
  const { isAuthenticated, user, isAdmin } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const cartCount = useSelector((s) => s.cart.totalItems) || 0
  const [cartOpen, setCartOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isHome = location.pathname === '/'
  const isOverHero = isHome && !scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isLightNav = theme === 'light'
  const navBg = isLightNav
    ? (isOverHero
      ? 'bg-white/95 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10'
      : 'bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-800')
    : (isOverHero
      ? 'bg-white/10 dark:bg-gray-900/60 backdrop-blur-md border-b border-white/10 dark:border-white/5'
      : 'bg-primary-700 dark:bg-primary-900 shadow-lg')
  const textClass = isLightNav ? 'text-gray-900 dark:text-white' : 'text-white'
  const linkHover = isLightNav ? 'hover:bg-gray-100 dark:hover:bg-white/10' : 'hover:bg-white/10'
  const underlineColor = isLightNav ? 'after:bg-primary-600 dark:after:bg-white' : 'after:bg-white'
  const linkUnderline = 'relative after:absolute after:left-0 after:bottom-0 after:h-0.5 after:transition-all after:duration-300 hover:after:w-full ' + underlineColor + ' after:w-0'

  return (
    <>
      <nav className={'sticky top-0 z-50 transition-all duration-300 ' + navBg + ' ' + textClass}>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Logo className={isLightNav ? 'text-primary-700 dark:text-white hover:text-primary-800 dark:hover:text-white shrink-0' : 'text-white hover:text-white shrink-0'} />
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                to="/products"
                className={'font-medium px-3 py-2 rounded-lg transition-colors ' + linkUnderline + ' ' + linkHover}
              >
                Products
              </Link>
              <button
                type="button"
                onClick={toggleTheme}
                className={'p-2 rounded-lg transition-colors ' + (isLightNav ? 'text-gray-600 dark:text-white/80 hover:bg-gray-100 dark:hover:bg-white/10' : 'text-white/80 hover:bg-white/10')}
                aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              {isAuthenticated ? (
                <>
                  {isAdmin ? (
                    <>
                      <Link to="/admin" className={'hidden sm:inline font-medium px-3 py-2 rounded-lg transition-colors ' + linkHover}>Dashboard</Link>
                      <Link to="/admin/products" className={'hidden sm:inline font-medium px-3 py-2 rounded-lg transition-colors ' + linkHover}>Products</Link>
                      <Link to="/admin/orders" className={'hidden sm:inline font-medium px-3 py-2 rounded-lg transition-colors ' + linkHover}>Orders</Link>
                      <Link to="/admin/users" className={'hidden sm:inline font-medium px-3 py-2 rounded-lg transition-colors ' + linkHover}>Users</Link>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setCartOpen(true)}
                        className={'relative p-2.5 rounded-xl transition-colors ' + (isLightNav ? 'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10' : 'text-white hover:bg-white/10')}
                        aria-label="Cart"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        {cartCount > 0 && (
                          <span className="absolute -top-0.5 -right-0.5 bg-primary-600 text-white text-xs font-bold min-w-[20px] h-5 rounded-full flex items-center justify-center">
                            {cartCount}
                          </span>
                        )}
                      </button>
                      <AccountDropdown user={user} />
                    </>
                  )}
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => { dispatch(logout()); navigate('/') }}
                      className={isLightNav ? 'bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors' : 'bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors'}
                    >
                      Logout
                    </button>
                  )}
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={isLightNav ? 'bg-primary-600 text-white hover:bg-primary-700 font-medium px-4 py-2.5 rounded-xl transition-colors shadow' : 'bg-white text-primary-700 hover:bg-primary-100 font-medium px-4 py-2.5 rounded-xl transition-colors shadow'}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className={isLightNav ? 'border-2 border-primary-600 text-primary-700 hover:bg-primary-50 font-medium px-4 py-2.5 rounded-xl transition-colors' : 'border-2 border-white text-white hover:bg-white/10 font-medium px-4 py-2.5 rounded-xl transition-colors'}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
