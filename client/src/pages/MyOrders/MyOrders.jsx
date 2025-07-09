import React, { useCallback, useEffect, useState } from 'react'
import './myorders.scss'
import axios from 'axios'
import { assets } from '../../assets/frontend_assets/assets'
import { useSelector } from 'react-redux'

const MyOrders = () => {

  const url = process.env.REACT_APP_URL
  const token = useSelector((state) => state.auth.token)
  const [data, setData] = useState([])

  const fetchOrders = useCallback(async () => {
    const response = await axios.post(`${url}/order/userorders`, {}, {headers: {token}})
    setData(response.data.data)
  }, [url, token])

  useEffect(() => {
    if (token) {
      fetchOrders()
    }
  }, [token, fetchOrders])

  const getStatusClass = (status) => {
    switch (status) {
      case "Food Processing":
        return "status-processing";
      case "Out for delivery":
        return "status-delivery";
      case "Delivered":
        return "status-delivered";
      case "Canceled":
        return "status-canceled";
      default:
        return "";
    }
  };

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {data.map((order, index) => (
          <div key={index} className="my-orders-order">
            <img src={assets.parcel_icon} alt="" />
            <p>
              {order.items.map((item, index) => {
                if (index === order.items.length - 1) {
                  return item.name + " x " + item.quantity
                } else {
                  return item.name + " x " + item.quantity + ", "
                }
              })}
            </p>
            <p>$ {(order.amount).toFixed(2)}</p>
            <p>Items: {order.items.length}</p>
            <p className='order-status'>
              <span className={getStatusClass(order.status)} >&#x25cf;</span> 
              <b className={getStatusClass(order.status)}>{order.status}</b>
            </p>
            <button onClick={fetchOrders}>Track Order</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyOrders
