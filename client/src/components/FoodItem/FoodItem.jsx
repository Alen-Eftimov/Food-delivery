import React from 'react'
import './food-item.scss'
import { useDispatch, useSelector } from 'react-redux'
import { assets } from '../../assets/frontend_assets/assets'
import { addToCart, removeFromCart } from '../../redux/cartSlice'

const FoodItem = ({ id, name, image, price, description }) => {
  const dispatch = useDispatch()
  const cartItems = useSelector((state) => state.cart.cartItems)
  const token = useSelector((state) => state.auth.token)
  const handleAdd = () => {
    dispatch(addToCart(id, token))
  }

  const handleRemove = () => {
    dispatch(removeFromCart(id, token))
  }

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img src={image} alt={name} className="food-item-img" />
        {!cartItems[id] 
          ? <img src={assets.add_icon_white} onClick={handleAdd} alt="" className="add" />
          : <div className="food-item-counter">
              <img onClick={handleRemove} src={assets.remove_icon_red} alt="" />
              <p>{cartItems[id]}</p>
              <img onClick={handleAdd} src={assets.add_icon_green} alt="" />
          </div> }
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="" />
        </div>
        <p className="food-item-desc">{description}</p>
        <div className="food-item-price">${price}</div>
      </div>
    </div>
  )
}

export default FoodItem
