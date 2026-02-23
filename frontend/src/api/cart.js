import api from './axios'

export const getCart = () => api.get('/customer/cart')
export const addToCart = (product_id, quantity = 1) => api.post('/customer/cart', { product_id, quantity })
export const updateCartItem = (id, quantity) => api.patch(`/customer/cart/${id}`, { quantity })
export const removeFromCart = (id) => api.delete(`/customer/cart/${id}`)
export const clearCart = () => api.delete('/customer/cart/clear')
