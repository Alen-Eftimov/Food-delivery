import React, { useState } from 'react'
import './login_popup.scss'
import { assets } from '../../assets/frontend_assets/assets'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setToken } from '../../redux/authSlice';

const LoginPopup = ({setShowLogin}) => {

  const dispatch = useDispatch()
  const url = process.env.REACT_APP_URL

  const [currState, setCurrState] = useState('Login')
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  })

  const [errorMessage, setErrorMessage] = useState(''); 

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value
    setData(data => ({...data, [name]: value}))
    setErrorMessage('');
  }

  const onLogin = async (event) => {
    event.preventDefault()
    setErrorMessage('');

    let newUrl = url
    if (currState ==='Login') {
      newUrl += "/user/login"
    } else {
      newUrl += "/user/register"
    }

    try {
      const response = await axios.post(newUrl, data);

      if (response.data.success) {
        dispatch(setToken(response.data.token));
        localStorage.setItem("token", response.data.token);
        setShowLogin(false);
      } else {
        setErrorMessage(response.data.message || 'An unknown error occurred.');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Failed to connect to the server. Please try again.');
      }
    }
  }


  return (
    <div className="login-popup">
      <form className="login-popup-container" onSubmit={onLogin}>
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>
        <div className="login-popup-inputs">
          {currState === 'Login' ? <></> : <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required />}
          <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required />
          <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
        <button type='submit'>{currState === 'Sign Up' ? "Create account" : "Login"}</button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
        {currState === 'Login'
          ? <p>Create a new account? <span onClick={() => setCurrState('Sign Up')}>Click here</span></p>
          : <p>Already have an account? <span onClick={() => setCurrState('Login')}>Click here</span></p>
        }
      </form>
    </div>
  )
}

export default LoginPopup

