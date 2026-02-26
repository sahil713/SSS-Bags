import api from './axios'

export const getProfile = () => api.get('/customer/profile')

export const updateProfile = (data) => {
  if (data.avatar instanceof File) {
    const form = new FormData()
    form.append('name', data.name ?? '')
    form.append('phone_number', data.phone_number ?? '')
    form.append('avatar', data.avatar)
    return api.patch('/customer/profile', form, {
      headers: { 'Content-Type': undefined },
    })
  }
  return api.patch('/customer/profile', data)
}
