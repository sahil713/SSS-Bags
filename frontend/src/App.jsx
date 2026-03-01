import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Layout from './components/Layout'
import LogoLoader from './components/ui/LogoLoader'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Login from './pages/Login'
import Signup from './pages/Signup'
import VerifyEmail from './pages/VerifyEmail'
import VerifyOtp from './pages/VerifyOtp'
import Profile from './pages/customer/Profile'
import Cart from './pages/customer/Cart'
import Orders from './pages/customer/Orders'
import MyOrders from './pages/MyOrders'
import OrderTrack from './pages/customer/OrderTrack'
import AdminDashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import AdminProductForm from './pages/admin/ProductForm'
import AdminOrders from './pages/admin/Orders'
import AdminUsers from './pages/admin/Users'
import AdminBanners from './pages/admin/Banners'
import AdminAnnouncements from './pages/admin/Announcements'
import ProtectedRoute from './components/ProtectedRoute'
import EmailVerifiedRoute from './components/EmailVerifiedRoute'
import InvestmentsDashboard from './pages/investments/Dashboard'
import InvestmentsPortfolio from './pages/investments/Portfolio'
import AddHolding from './pages/investments/AddHolding'
import EditHolding from './pages/investments/EditHolding'
import UploadStatement from './pages/investments/UploadStatement'
import Strategies from './pages/investments/Strategies'
import InvestmentsReports from './pages/investments/Reports'
import InvestmentsTips from './pages/investments/Tips'
import SellTiming from './pages/investments/SellTiming'
import DataEntry from './pages/investments/DataEntry'

function loginRedirectTo(user) {
  if (!user) return '/'
  if (user.role === 'admin') return '/admin'
  if (user.role === 'customer') {
    if (!user.email_verified) return '/verify-email'
    if (!user.phone_verified) return '/verify-otp'
  }
  return '/'
}

export default function App() {
  const { isAuthenticated, user } = useAuth()
  const [showLoader, setShowLoader] = useState(true)

  if (showLoader) {
    return <LogoLoader onDone={() => setShowLoader(false)} />
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Landing />} />
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

        <Route path="investments" element={<EmailVerifiedRoute><InvestmentsDashboard /></EmailVerifiedRoute>} />
        <Route path="investments/portfolio" element={<EmailVerifiedRoute><InvestmentsPortfolio /></EmailVerifiedRoute>} />
        <Route path="investments/holdings/add" element={<EmailVerifiedRoute><AddHolding /></EmailVerifiedRoute>} />
        <Route path="investments/holdings/:id/edit" element={<EmailVerifiedRoute><EditHolding /></EmailVerifiedRoute>} />
        <Route path="investments/upload-statement" element={<EmailVerifiedRoute><UploadStatement /></EmailVerifiedRoute>} />
        <Route path="investments/strategies" element={<EmailVerifiedRoute><Strategies /></EmailVerifiedRoute>} />
        <Route path="investments/reports" element={<EmailVerifiedRoute><InvestmentsReports /></EmailVerifiedRoute>} />
        <Route path="investments/data-entry" element={<EmailVerifiedRoute><DataEntry /></EmailVerifiedRoute>} />
        <Route path="investments/tips" element={<EmailVerifiedRoute><InvestmentsTips /></EmailVerifiedRoute>} />
        <Route path="investments/sell-timing" element={<EmailVerifiedRoute><SellTiming /></EmailVerifiedRoute>} />

        <Route path="admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="admin/products" element={<ProtectedRoute allowedRoles={['admin']}><AdminProducts /></ProtectedRoute>} />
        <Route path="admin/products/new" element={<ProtectedRoute allowedRoles={['admin']}><AdminProductForm /></ProtectedRoute>} />
        <Route path="admin/products/:slug/edit" element={<ProtectedRoute allowedRoles={['admin']}><AdminProductForm /></ProtectedRoute>} />
        <Route path="admin/orders" element={<ProtectedRoute allowedRoles={['admin']}><AdminOrders /></ProtectedRoute>} />
        <Route path="admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>} />
        <Route path="admin/banners" element={<ProtectedRoute allowedRoles={['admin']}><AdminBanners /></ProtectedRoute>} />
        <Route path="admin/announcements" element={<ProtectedRoute allowedRoles={['admin']}><AdminAnnouncements /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
