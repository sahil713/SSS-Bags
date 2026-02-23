import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/slices/authSlice'

export default function Navbar() {
  const { isAuthenticated, user, isAdmin } = useAuth()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const cartCount = useSelector((s) => s.cart.totalItems) || 0

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <nav className="bg-primary-700 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="text-xl font-bold hover:text-primary-200 focus:ring-2 focus:ring-primary-300 rounded px-2 py-1">
            SSS BAGS
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/products" className="hover:text-primary-200 focus:ring-2 focus:ring-primary-300 rounded px-2 py-1">
              Products
            </Link>
            {isAuthenticated ? (
              <>
                {isAdmin ? (
                  <>
                    <Link to="/admin" className="hover:text-primary-200 rounded px-2 py-1">Dashboard</Link>
                    <Link to="/admin/products" className="hover:text-primary-200 rounded px-2 py-1">Products</Link>
                    <Link to="/admin/orders" className="hover:text-primary-200 rounded px-2 py-1">Orders</Link>
                    <Link to="/admin/users" className="hover:text-primary-200 rounded px-2 py-1">Users</Link>
                  </>
                ) : (
                  <>
                    <Link to="/cart" className="hover:text-primary-200 rounded px-2 py-1 flex items-center gap-1">
                      Cart {cartCount > 0 && <span className="bg-primary-500 text-xs px-1.5 py-0.5 rounded-full">{cartCount}</span>}
                    </Link>
                    <Link to="/orders" className="hover:text-primary-200 rounded px-2 py-1">Orders</Link>
                    <Link to="/profile" className="hover:text-primary-200 rounded px-2 py-1">Profile</Link>
                  </>
                )}
                <span className="text-primary-200 text-sm">{user?.name}</span>
                <button type="button" onClick={handleLogout} className="bg-primary-600 hover:bg-primary-800 rounded px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-primary-300">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="bg-primary-600 hover:bg-primary-800 rounded px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-primary-300">
                  Login
                </Link>
                <Link to="/signup" className="border border-primary-300 hover:bg-primary-600 rounded px-3 py-1.5 text-sm font-medium">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
