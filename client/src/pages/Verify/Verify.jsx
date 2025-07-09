import React, { useCallback, useEffect } from 'react'
import './verify.scss'
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../redux/cartSlice';

const Verify = () => {

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const success = searchParams.get("success")
  const userId = searchParams.get("userId")
  const amount = searchParams.get("amount")
  const address = searchParams.get("address")
  const items = searchParams.get("items")
  const dispatch = useDispatch();

  const url = process.env.REACT_APP_URL

  const verifyPayment = useCallback(async () => {
    const response = await axios.post(`${url}/order/verify`, { success, userId, amount, address, items });

    if (response.data.success) {
      dispatch(clearCart()); 
      navigate('/myorders');
    } else {
      navigate("/");
    }
  }, [url, success, userId, amount, address, items, navigate, dispatch]);

  useEffect(() => {
    verifyPayment()
  }, [verifyPayment])

  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  )
}

export default Verify
