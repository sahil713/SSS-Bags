import api from './axios'

export const getAddresses = () => api.get('/customer/addresses')
export const createAddress = (data) => api.post('/customer/addresses', data)
export const updateAddress = (id, data) => api.patch(`/customer/addresses/${id}`, data)
export const deleteAddress = (id) => api.delete(`/customer/addresses/${id}`)
