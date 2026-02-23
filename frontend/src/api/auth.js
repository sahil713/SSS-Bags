import api from './axios'

export const signup = (body) => api.post('/auth/signup', body)
export const login = (body) => api.post('/auth/login', body)
export const refresh = () => api.post('/auth/refresh', {}, { headers: { 'X-Refresh-Token': localStorage.getItem('refresh_token') } })
export const verifyEmail = (email, token) => api.post('/auth/verify_email', { email, token })
export const sendOtp = (email) => api.post('/auth/send_otp', { email })
export const verifyOtp = (email, otp_code) => api.post('/auth/verify_otp', { email, otp_code })
