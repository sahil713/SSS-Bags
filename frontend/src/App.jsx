import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import LogoLoader from './components/ui/LogoLoader'
import Landing from './pages/Landing'
import Collection from './pages/Collection'
import StyleDetail from './pages/StyleDetail'
import VisitUs from './pages/VisitUs'

/*
 * ─── BACKEND DISABLED ────────────────────────────────────────────────────────
 * The Rails API is not deployed right now, so the site runs as a static
 * showcase (Cloudflare Workers, see frontend/wrangler.jsonc). Everything below
 * needs the API — accounts, cart, orders and the admin panel — and is commented
 * out until the backend is live again. To re-enable:
 *   1. Uncomment these imports and the routes further down.
 *   2. Point VITE_API_URL at the deployed API.
 *   3. Swap the /products routes back to Products / ProductDetail.
 *   4. Restore the commented blocks in Layout.jsx, Navbar.jsx and Footer.jsx.
 *
 * import { useAuth } from './hooks/useAuth'
 * import Home from './pages/Home'
 * import Products from './pages/Products'
 * import ProductDetail from './pages/ProductDetail'
 * import Login from './pages/Login'
 * import Signup from './pages/Signup'
 * import VerifyEmail from './pages/VerifyEmail'
 * import VerifyOtp from './pages/VerifyOtp'
 * import Profile from './pages/customer/Profile'
 * import Cart from './pages/customer/Cart'
 * import Orders from './pages/customer/Orders'
 * import MyOrders from './pages/MyOrders'
 * import OrderTrack from './pages/customer/OrderTrack'
 * import AdminDashboard from './pages/admin/Dashboard'
 * import AdminProducts from './pages/admin/Products'
 * import AdminProductForm from './pages/admin/ProductForm'
 * import AdminOrders from './pages/admin/Orders'
 * import AdminUsers from './pages/admin/Users'
 * import AdminBanners from './pages/admin/Banners'
 * import AdminAnnouncements from './pages/admin/Announcements'
 * import ProtectedRoute from './components/ProtectedRoute'
 *
 * function loginRedirectTo(user) {
 *   if (!user) return '/'
 *   if (user.role === 'admin') return '/admin'
 *   if (user.role === 'customer') {
 *     if (!user.email_verified) return '/verify-email'
 *     if (!user.phone_verified) return '/verify-otp'
 *   }
 *   return '/'
 * }
 * ─────────────────────────────────────────────────────────────────────────────
 */

export default function App() {
  const [showLoader, setShowLoader] = useState(true)

  if (showLoader) {
    return <LogoLoader onDone={() => setShowLoader(false)} />
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="products" element={<Collection />} />
        <Route path="products/:slug" element={<StyleDetail />} />
        <Route path="visit-us" element={<VisitUs />} />

        {/* Backend routes — re-enable together with the imports above.
        <Route path="home" element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:slug" element={<ProductDetail />} />
        <Route path="login" element={isAuthenticated ? <Navigate to={loginRedirectTo(user)} replace /> : <Login />} />
        <Route path="signup" element={isAuthenticated ? <Navigate to={loginRedirectTo(user)} replace /> : <Signup />} />
        <Route path="verify-email" element={<VerifyEmail />} />
        <Route path="verify-otp" element={<VerifyOtp />} />

        <Route path="profile" element={<ProtectedRoute allowedRoles={['customer', 'admin']}><Profile /></ProtectedRoute>} />
        <Route path="cart" element={<ProtectedRoute allowedRoles={['customer']}><Cart /></ProtectedRoute>} />
        <Route path="orders" element={<ProtectedRoute allowedRoles={['customer']}><Orders /></ProtectedRoute>} />
        <Route path="my-orders" element={<ProtectedRoute allowedRoles={['customer']}><MyOrders /></ProtectedRoute>} />
        <Route path="orders/:id/track" element={<ProtectedRoute allowedRoles={['customer']}><OrderTrack /></ProtectedRoute>} />

        <Route path="admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="admin/products" element={<ProtectedRoute allowedRoles={['admin']}><AdminProducts /></ProtectedRoute>} />
        <Route path="admin/products/new" element={<ProtectedRoute allowedRoles={['admin']}><AdminProductForm /></ProtectedRoute>} />
        <Route path="admin/products/:slug/edit" element={<ProtectedRoute allowedRoles={['admin']}><AdminProductForm /></ProtectedRoute>} />
        <Route path="admin/orders" element={<ProtectedRoute allowedRoles={['admin']}><AdminOrders /></ProtectedRoute>} />
        <Route path="admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>} />
        <Route path="admin/banners" element={<ProtectedRoute allowedRoles={['admin']}><AdminBanners /></ProtectedRoute>} />
        <Route path="admin/announcements" element={<ProtectedRoute allowedRoles={['admin']}><AdminAnnouncements /></ProtectedRoute>} />
        */}
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
