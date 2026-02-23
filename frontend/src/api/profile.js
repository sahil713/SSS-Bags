import api from './axios'

export const getProfile = () => api.get('/customer/profile')
export const updateProfile = (data) => api.patch('/customer/profile', data)
