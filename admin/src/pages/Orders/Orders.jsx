import React, { useCallback, useEffect, useState } from 'react'
import './orders.scss'
import axios from 'axios'
import {toast} from 'react-toastify'
import { assets } from '../../assets/admin_assets/assets.js'

const Orders = ({url}) => {

  const [orders, setOrders] = useState([])
  
  const fetchAllOrders = useCallback(async () => {
    const response = await axios.get(`${url}/order/list`); 
    if (response.data.success) {
      const formattedOrders = response.data.data.map(order => {
        return {
          ...order,
          items: JSON.parse(order.items || '[]'),
          address: JSON.parse(order.address || '{}'),
          status: order.status.replace(/^'|'$/g, '')
        };
      });
      setOrders(formattedOrders);
    } else {
      toast.error('Error')
    }
  }, [url])

  useEffect(() => {
    fetchAllOrders()
  }, [fetchAllOrders])

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(`${url}/order/status`, {
      orderId,
      status: event.target.value
    })
    if (response.data.success) {
      await fetchAllOrders()
      toast.success('Order status updated successfully')
    } else {
      toast.error('Error updating order status');
    }
  } 

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
    <div className="order add">
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className="order-item">
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className="order-item-food">
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + " x " + item.quantity
                  } else {
                    return item.name + " x " + item.quantity + ", "
                  }
                })}
              </p>
              <p className="order-item-date">
                {new Date(order.date).toLocaleTimeString('en-GB', [], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
                &nbsp;&nbsp;
                {new Date(order.date).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'numeric',
                  year: 'numeric'
                }).replace(/\//g, '.')} 
              </p>
              <p className="order-item-name">{order.address.firstName + " " + order.address.lastName}</p>
              <div className="order-item-address">
                <p>{order.address.street + ", "}</p>
                <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
              </div>
              <p className="order-item-phone">{order.address.phone}</p>
            </div>
            <p>Items : {order.items.length}</p>
            <p>${order.amount}</p>
            <select onChange={(event) => statusHandler(event, order.id)} value={order.status} className={getStatusClass(order.status)}>
              <option value="Food Processing">Food Processing</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
