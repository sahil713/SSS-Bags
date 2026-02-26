import { useEffect, useState } from 'react'
import { Outlet, useLocation, Navigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Navbar from './Navbar'
import Footer from './layout/Footer'
import AnnouncementBar from './banner/AnnouncementBar'
import { useAuth } from '../hooks/useAuth'
import { getCart } from '../api/cart'
import { getAnnouncements } from '../api/banners'
import { setCart } from '../store/slices/cartSlice'

const ALLOWED_WITHOUT_EMAIL_VERIFIED = ['/login', '/signup', '/verify-email']
const ALLOWED_WITHOUT_PHONE_VERIFIED = ['/login', '/signup', '/verify-email', '/verify-otp']

export default function Layout() {
  const dispatch = useDispatch()
  const location = useLocation()
  const { isAuthenticated, isCustomer, user } = useAuth()
  const [announcements, setAnnouncements] = useState([])

  const mustVerifyEmail = isAuthenticated && isCustomer && user && !user.email_verified
  const mustVerifyPhone = isAuthenticated && isCustomer && user && user.email_verified && !user.phone_verified

  if (mustVerifyEmail && !ALLOWED_WITHOUT_EMAIL_VERIFIED.includes(location.pathname)) {
    return <Navigate to="/verify-email" replace state={{ email: user?.email }} />
  }
  if (mustVerifyPhone && !ALLOWED_WITHOUT_PHONE_VERIFIED.includes(location.pathname)) {
    return <Navigate to="/verify-otp" replace />
  }

  useEffect(() => {
    if (isAuthenticated && isCustomer) {
      getCart().then((r) => dispatch(setCart(r.data))).catch(() => {})
    }
  }, [isAuthenticated, isCustomer, dispatch])

  useEffect(() => {
    getAnnouncements().then((r) => setAnnouncements(r.data.announcements || [])).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <AnnouncementBar announcements={announcements} />
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
