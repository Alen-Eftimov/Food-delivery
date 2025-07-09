import React, { useEffect, useState } from 'react'
import './place-order.scss'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getTotalCartAmount } from '../../redux/cartSelectors'

const PlaceOrder = () => {

  const navigate = useNavigate()

  const url = process.env.REACT_APP_URL
  const token = useSelector((state) => state.auth.token)
  const cartItems = useSelector((state) => state.cart.cartItems);
  const cartAmount = useSelector((state) => getTotalCartAmount(state))
  const food_list = useSelector((state) => state.food.foodList); 

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value; 
    setData(data => ({...data,[name]:value}))
  }

  const placeOrder = async (event) => {
    event.preventDefault()
    let orderItems = []
    food_list.forEach((item) => {
      if (cartItems[item.id] > 0) {
        let itemInfo = { ...item, quantity: cartItems[item.id] };
        orderItems.push(itemInfo)
      }      
    })
    let orderData = {
      address: data,
      items: orderItems,
      amount: cartAmount + 2
    }

    let response = await axios.post(`${url}/order/place`, orderData, {headers: {token}})
    if (response.data.success) {
      const {session_url} = response.data
      window.location.replace(session_url)
    } else {
      alert('Error')
    }
  }

  useEffect(() => {
    if (!token) {
      navigate('/cart')
    } else if (cartAmount === 0) {
      navigate('/cart')
    }
  }, [token, navigate, cartAmount])

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input onChange={onChangeHandler} name='firstName' value={data.firstName} type="text" placeholder='First name' required />
          <input onChange={onChangeHandler} name='lastName' value={data.lastName} type="text" placeholder='Last name' required />
        </div>
        <input onChange={onChangeHandler} name='email' value={data.email} type="text" placeholder='Email address' required />
        <input onChange={onChangeHandler} name='street' value={data.street} type="text" placeholder='Street' required />
        <div className="multi-fields">
          <input onChange={onChangeHandler} name='city' value={data.city} type="text" placeholder='City' required />
          <input onChange={onChangeHandler} name='state' value={data.state} type="text" placeholder='State' required />
        </div>
        <div className="multi-fields">
          <input onChange={onChangeHandler} name='zipcode' value={data.zipcode} type="text" placeholder='Zip code' required />
          <input onChange={onChangeHandler} name='country' value={data.country} type="text" placeholder='Country' required />
        </div>
        <input onChange={onChangeHandler} name='phone' value={data.phone} type="text" placeholder='Phone' required />
      </div>
      <div className="place-order-right">
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
            <button type='submit'>PROCEED TO PAYMENT</button>
          </div>
      </div>
    </form>
  )
}

export default PlaceOrder
