import api from './axios'

export const getBanners = (params) => api.get('/banners', { params })
export const getAnnouncements = () => api.get('/announcements')
