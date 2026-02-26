import api from './axios'

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1'

export const getProfile = () => api.get('/customer/profile')

export const updateProfile = async (data) => {
  if (data.avatar instanceof File) {
    const form = new FormData()
    form.append('name', data.name ?? '')
    form.append('phone_number', data.phone_number ?? '')
    form.append('avatar', data.avatar)
    const url = `${API_BASE}/customer/profile`
    const token = localStorage.getItem('access_token')
    const res = await fetch(url, {
      method: 'PATCH',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.errors?.join?.(', ') || 'Update failed')
    return { data: json }
  }
  return api.patch('/customer/profile', data)
}
