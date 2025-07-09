import { createSelector } from 'reselect'

const selectCartItems = (state) => state.cart.cartItems
const selectFoodList = (state) => state.food.foodList

export const getTotalCartAmount = createSelector(
  [selectCartItems, selectFoodList],
  (cartItems, foodList) => {
    let totalAmount = 0
    for (const itemId in cartItems) {
      const quantity = cartItems[itemId]
      if (quantity > 0) {
        const itemInfo = foodList.find(
          (product) => String(product.id) === itemId
        )
        if (itemInfo) {
          totalAmount += itemInfo.price * quantity
        } else {
          console.warn(`Item with id ${itemId} not found in food_list`)
        }
      }
    }
    return totalAmount
  }
)