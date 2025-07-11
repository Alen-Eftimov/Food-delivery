import React from 'react'
import './cart.scss'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { removeFromCart } from '../../redux/cartSlice'
import { getTotalCartAmount } from '../../redux/cartSelectors'

const Cart = ({ setShowLogin }) => {

  const navigate = useNavigate()
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.cartItems);
  const cartAmount = useSelector((state) => getTotalCartAmount(state))
  const food_list = useSelector((state) => state.food.foodList);
  const token = useSelector((state) => state.auth.token);

  const handleRemoveFromCart = (itemId) => {
    dispatch(removeFromCart(itemId, token));
  };

  const handleProceedToCheckout = () => {
    if (!token) {
      setShowLogin(true);
    } else {
      navigate('/order');
    }
  };

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item.id] > 0) {            
            return (
              <div key={index}>
                <div className="cart-items-title cart-items-item">
                  <img src={item.image} alt={item.name}/>
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <p>{cartItems[item.id]}</p>
                  <p>${item.price * cartItems[item.id]}</p>
                  <p onClick={() => handleRemoveFromCart(item.id)} className='cross'>Remove x 1</p>
                </div>
                <hr />
              </div>
            )
          }
          return null
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>CartTotals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${cartAmount}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${cartAmount === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${cartAmount === 0 ? 0 : cartAmount+2}</b>
            </div>
          </div>          
          <button onClick={handleProceedToCheckout}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, Enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder='promo code' />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 

export default Cart
