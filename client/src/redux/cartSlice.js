import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const url = process.env.REACT_APP_URL

const initialState = {
  cartItems: {},
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems(state, action) {
      state.cartItems = action.payload
    },
    addItem(state, action) {
      const itemId = action.payload
      state.cartItems[itemId] = (state.cartItems[itemId] || 0) + 1
    },
    removeItem(state, action) {
      const itemId = action.payload
      if (state.cartItems[itemId]) {
        state.cartItems[itemId] -= 1
        if (state.cartItems[itemId] <= 0) {
          delete state.cartItems[itemId]
        }
      }
    },
    clearCart(state) {
      state.cartItems = {}
    },
  },
})

export const { setCartItems, addItem, removeItem, clearCart } = cartSlice.actions

export const loadCartData = (token) => async (dispatch) => {
  try {
    const response = await axios.post(`${url}/cart/get`, {}, { headers: { token } })
    dispatch(setCartItems(response.data.cartData))
  } catch (err) {
    console.error('Failed to load cart data:', err)
  }
}

export const addToCart = (itemId, token) => async (dispatch, getState) => {
  dispatch(addItem(itemId))
  const { cart } = getState()
  if (token) {
    await axios.post(`${url}/cart/add`, { cartItems: cart.cartItems, itemId }, { headers: { token } })
  }
}

export const removeFromCart = (itemId, token) => async (dispatch, getState) => {
  dispatch(removeItem(itemId))
  const { cart } = getState()
  if (token) {
    await axios.put(`${url}/cart/remove`, { cartItems: cart.cartItems, itemId }, { headers: { token } })
  }
}

export default cartSlice.reducer