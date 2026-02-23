import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Layout from './components/Layout'
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
import OrderTrack from './pages/customer/OrderTrack'
import AdminDashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import AdminProductForm from './pages/admin/ProductForm'
import AdminOrders from './pages/admin/Orders'
import AdminUsers from './pages/admin/Users'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  const { isAuthenticated, user } = useAuth()

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:slug" element={<ProductDetail />} />
        <Route path="login" element={isAuthenticated ? <Navigate to={user?.role === 'admin' ? '/admin' : '/'} replace /> : <Login />} />
        <Route path="signup" element={isAuthenticated ? <Navigate to="/" replace /> : <Signup />} />
        <Route path="verify-email" element={<VerifyEmail />} />
        <Route path="verify-otp" element={<VerifyOtp />} />

        <Route path="profile" element={<ProtectedRoute allowedRoles={['customer', 'admin']}><Profile /></ProtectedRoute>} />
        <Route path="cart" element={<ProtectedRoute allowedRoles={['customer']}><Cart /></ProtectedRoute>} />
        <Route path="orders" element={<ProtectedRoute allowedRoles={['customer']}><Orders /></ProtectedRoute>} />
        <Route path="orders/:id/track" element={<ProtectedRoute allowedRoles={['customer']}><OrderTrack /></ProtectedRoute>} />

        <Route path="admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="admin/products" element={<ProtectedRoute allowedRoles={['admin']}><AdminProducts /></ProtectedRoute>} />
        <Route path="admin/products/new" element={<ProtectedRoute allowedRoles={['admin']}><AdminProductForm /></ProtectedRoute>} />
        <Route path="admin/products/:slug/edit" element={<ProtectedRoute allowedRoles={['admin']}><AdminProductForm /></ProtectedRoute>} />
        <Route path="admin/orders" element={<ProtectedRoute allowedRoles={['admin']}><AdminOrders /></ProtectedRoute>} />
        <Route path="admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
