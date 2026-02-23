import api from './axios'

export const getDashboard = () => api.get('/admin/dashboard')
export const getUsers = (params) => api.get('/admin/users', { params })
export const getUser = (id) => api.get(`/admin/users/${id}`)
export const updateUser = (id, data) => api.patch(`/admin/users/${id}`, data)
export const getAdminCategories = () => api.get('/admin/categories')
export const createCategory = (data) => api.post('/admin/categories', data)
export const updateCategory = (slug, data) => api.patch(`/admin/categories/${slug}`, data)
export const deleteCategory = (slug) => api.delete(`/admin/categories/${slug}`)
export const getAdminProducts = (params) => api.get('/admin/products', { params })
export const getAdminProduct = (slug) => api.get(`/admin/products/${slug}`)
export const createProduct = (data) => api.post('/admin/products', data)
export const updateProduct = (slug, data) => api.patch(`/admin/products/${slug}`, data)
export const deleteProduct = (slug) => api.delete(`/admin/products/${slug}`)
export const toggleProductStatus = (slug) => api.patch(`/admin/products/${slug}/toggle_status`)
export const uploadImage = (file) => {
  const form = new FormData()
  form.append('file', file)
  return api.post('/admin/uploads', form, { headers: { 'Content-Type': 'multipart/form-data' } })
}
export const getAdminOrders = (params) => api.get('/admin/orders', { params })
export const getAdminOrder = (id) => api.get(`/admin/orders/${id}`)
export const updateOrderStatus = (id, status) => api.patch(`/admin/orders/${id}/update_status`, { status })
