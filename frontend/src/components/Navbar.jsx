import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/slices/authSlice'
import Logo from './ui/Logo'
import CartDrawer from './common/CartDrawer'
import AccountDropdown from './common/AccountDropdown'

export default function Navbar() {
  const { isAuthenticated, user, isAdmin } = useAuth()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const cartCount = useSelector((s) => s.cart.totalItems) || 0
  const [cartOpen, setCartOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navBg = 'bg-black/40 backdrop-blur-md border-b border-white/10' + (scrolled ? ' shadow-lg' : '')
  const textClass = 'text-white'
  const linkHover = 'hover:bg-white/10'
  const linkUnderline = 'relative after:absolute after:left-0 after:bottom-0 after:h-0.5 after:transition-all after:duration-300 hover:after:w-full after:bg-white after:w-0'

  return (
    <>
      <nav className={'sticky top-0 z-50 transition-all duration-300 ' + navBg + ' ' + textClass}>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Logo className="text-white hover:text-white shrink-0" />
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                to="/products"
                className={'font-medium px-3 py-2 rounded-lg transition-colors ' + linkUnderline + ' ' + linkHover}
              >
                Products
              </Link>
              <Link
                to="/visit-us"
                className={'hidden sm:inline font-medium px-3 py-2 rounded-lg transition-colors ' + linkUnderline + ' ' + linkHover}
              >
                Visit Us
              </Link>
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
                        className="relative p-2.5 rounded-xl transition-colors text-white hover:bg-white/10"
                        aria-label="Cart"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        {cartCount > 0 && (
                          <span className="absolute -top-0.5 -right-0.5 bg-primary-600 text-white text-xs font-bold min-w-[20px] h-5 rounded-full flex items-center justify-center">
                            {cartCount}
                          </span>
                        )}
                      </button>
                      <AccountDropdown key={user?.avatar_url || user?.id} user={user} />
                    </>
                  )}
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => { dispatch(logout()); navigate('/') }}
                      className="bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                    >
                      Logout
                    </button>
                  )}
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="bg-white text-gray-900 hover:bg-primary-50 font-medium px-4 py-2.5 rounded-xl transition-colors shadow"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="border-2 border-white/40 text-white hover:bg-white/10 font-medium px-4 py-2.5 rounded-xl transition-colors"
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
