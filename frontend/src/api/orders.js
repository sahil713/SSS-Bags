import api from './axios'

export const getOrders = (params) => api.get('/customer/orders', { params })
export const getOrder = (id) => api.get(`/customer/orders/${id}`)
export const createOrder = (shipping_address) => api.post('/customer/orders', shipping_address)
export const trackOrder = (id) => api.get(`/customer/orders/${id}/track`)
export const cancelOrder = (id) => api.post(`/customer/orders/${id}/cancel`)
