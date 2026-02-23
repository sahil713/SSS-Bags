import { createSlice } from '@reduxjs/toolkit'

const loadFromStorage = () => {
  try {
    const t = localStorage.getItem('access_token')
    const u = localStorage.getItem('user')
    if (t && u) return { token: t, user: JSON.parse(u) }
  } catch (_) {}
  return { token: null, user: null }
}

const initialState = loadFromStorage()

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, { payload }) => {
      if (payload.access_token !== undefined) {
        state.token = payload.access_token
        if (payload.access_token) localStorage.setItem('access_token', payload.access_token)
        else localStorage.removeItem('access_token')
      }
      if (payload.user !== undefined) {
        state.user = payload.user
        if (payload.user) localStorage.setItem('user', JSON.stringify(payload.user))
        else localStorage.removeItem('user')
      }
    },
    setRefreshToken: (state, { payload }) => {
      if (payload.refresh_token) localStorage.setItem('refresh_token', payload.refresh_token)
    },
    logout: (state) => {
      state.token = null
      state.user = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
    },
    updateUser: (state, { payload }) => {
      if (state.user && payload) {
        state.user = { ...state.user, ...payload }
        localStorage.setItem('user', JSON.stringify(state.user))
      }
    },
  },
})

export const { setCredentials, setRefreshToken, logout, updateUser } = authSlice.actions
export default authSlice.reducer
