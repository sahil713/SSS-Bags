import api from './axios'

export const getCategories = () => api.get('/categories')
export const getCategory = (slug) => api.get(`/categories/${slug}`)
