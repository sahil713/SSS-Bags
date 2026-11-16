import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './layout/Footer'
import AnnouncementBar from './banner/AnnouncementBar'
import WhatsAppFloat from './common/WhatsAppFloat'

/*
 * BACKEND DISABLED — restore these when the API is live (see App.jsx).
 *
 * import { useEffect, useState } from 'react'
 * import { Navigate } from 'react-router-dom'
 * import { useDispatch } from 'react-redux'
 * import { useAuth } from '../hooks/useAuth'
 * import { getCart } from '../api/cart'
 * import { getAnnouncements } from '../api/banners'
 * import { setCart } from '../store/slices/cartSlice'
 *
 * const ALLOWED_WITHOUT_EMAIL_VERIFIED = ['/login', '/signup', '/verify-email']
 * const ALLOWED_WITHOUT_PHONE_VERIFIED = ['/login', '/signup', '/verify-email', '/verify-otp']
 *
 * Inside Layout():
 *   const dispatch = useDispatch()
 *   const { isAuthenticated, isCustomer, user } = useAuth()
 *   const [announcements, setAnnouncements] = useState([])
 *
 *   // Hooks must run before these early returns.
 *   useEffect(() => {
 *     if (isAuthenticated && isCustomer) {
 *       getCart().then((r) => dispatch(setCart(r.data))).catch(() => {})
 *     }
 *   }, [isAuthenticated, isCustomer, dispatch])
 *
 *   useEffect(() => {
 *     getAnnouncements().then((r) => setAnnouncements(r.data.announcements || [])).catch(() => {})
 *   }, [])
 *
 *   const mustVerifyEmail = isAuthenticated && isCustomer && user && !user.email_verified
 *   const mustVerifyPhone = isAuthenticated && isCustomer && user && user.email_verified && !user.phone_verified
 *   if (mustVerifyEmail && !ALLOWED_WITHOUT_EMAIL_VERIFIED.includes(location.pathname)) {
 *     return <Navigate to="/verify-email" replace state={{ email: user?.email }} />
 *   }
 *   if (mustVerifyPhone && !ALLOWED_WITHOUT_PHONE_VERIFIED.includes(location.pathname)) {
 *     return <Navigate to="/verify-otp" replace />
 *   }
 *
 * and pass announcements={announcements} to <AnnouncementBar />.
 */

export default function Layout() {
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) window.scrollTo(0, 0)
  }, [location.pathname, location.hash])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
