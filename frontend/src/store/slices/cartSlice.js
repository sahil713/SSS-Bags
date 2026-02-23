import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: { totalItems: 0, totalPrice: 0, items: [] },
  reducers: {
    setCart: (state, { payload }) => {
      state.items = payload?.items ?? []
      state.totalPrice = payload?.total_price ?? 0
      state.totalItems = payload?.total_items ?? 0
    },
    clearCart: (state) => {
      state.items = []
      state.totalPrice = 0
      state.totalItems = 0
    },
  },
})

export const { setCart, clearCart } = cartSlice.actions
export default cartSlice.reducer
