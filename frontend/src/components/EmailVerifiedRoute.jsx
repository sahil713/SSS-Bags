import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function EmailVerifiedRoute({ children }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  if (user?.role !== 'customer') {
    return <Navigate to="/" replace />
  }
  if (!user?.email_verified) {
    return <Navigate to="/verify-email" state={{ email: user?.email }} replace />
  }
  return children
}
