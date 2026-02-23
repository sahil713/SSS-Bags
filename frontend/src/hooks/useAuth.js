import { useSelector } from 'react-redux'

export function useAuth() {
  const { token, user } = useSelector((s) => s.auth)
  return {
    isAuthenticated: !!token,
    user,
    isAdmin: user?.role === 'admin',
    isCustomer: user?.role === 'customer',
  }
}
