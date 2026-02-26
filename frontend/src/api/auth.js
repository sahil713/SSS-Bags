import api from './axios'

export const signup = (body) => api.post('/auth/signup', body)
export const login = (body) => api.post('/auth/login', body)
export const refresh = () => api.post('/auth/refresh', {}, { headers: { 'X-Refresh-Token': localStorage.getItem('refresh_token') } })
export const verifyEmail = (email, token) => api.post('/auth/verify_email', { email, token })
export const resendVerificationEmail = () => api.post('/auth/resend_email_verification')
export const sendOtp = () => api.post('/auth/send_otp', {})
export const verifyOtp = (otp_code) => api.post('/auth/verify_otp', { otp_code })
