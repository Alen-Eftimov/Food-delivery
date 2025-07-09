import React, { useState } from 'react'
import './login.scss'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginAdmin } from '../../redux/apiCalls'
import { loginSuccess } from '../../redux/authReducer'
import {toast} from 'react-toastify'

const Login = () => { 
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  })
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handlChange = (e) => {
    setCredentials((prev) => ({...prev, [e.target.name]: e.target.value}))
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const data = await loginAdmin({...credentials})
      if (data.success) {
        dispatch(loginSuccess({ token: data.token, user: data.user, role: data.user.role }))
        navigate('/')
      }
    } catch (error) {
      console.log(error)
      toast.error('Login failed');
    }
  }
  
  return (
    <div className="login">
      <form className="login-container" onSubmit={handleLogin}>
        <h2 className="login-title">Food4U Admin Login</h2>
        <input type="email" className="login-input" placeholder='Email' value={credentials.email} name='email'onChange={handlChange} required />
        <input type="password" className="login-input" placeholder='Password' value={credentials.password} name='password'onChange={handlChange} required />
        <button type='submit' className="login-button">Login</button>
      </form>
    </div>
  )
}

export default Login
