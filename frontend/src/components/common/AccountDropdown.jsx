import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { logout } from '../../store/slices/authSlice'

export default function AccountDropdown({ user }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    setOpen(false)
    navigate('/')
  }

  const initial = user?.name?.trim().slice(0, 2).toUpperCase() || 'U'

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-center w-9 h-9 rounded-full overflow-hidden bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm shadow-md focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-700 shrink-0"
        aria-label="Account menu"
      >
        {user?.avatar_url ? (
          <img key={user.avatar_url} src={user.avatar_url} alt="" className="w-full h-full object-cover" />
        ) : (
          initial
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2 w-48 py-1 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg z-50"
          >
            <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
            </div>
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              My Profile
            </Link>
            <Link
              to="/my-orders"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              My Orders
            </Link>
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Settings
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
