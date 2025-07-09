import React, { useState } from 'react'
import './navbar.scss'
import { assets } from '../../assets/frontend_assets/assets.js'
import {Link, useNavigate} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getTotalCartAmount } from '../../redux/cartSelectors.js'
import { setToken } from '../../redux/authSlice.js'

const Navbar = ({setShowLogin}) => { 

  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const [menu, setMenu] = useState('home')
  const token = useSelector((state) => state.auth.token)
  const cartAmount = useSelector((state) => getTotalCartAmount(state))

  const logout = () => {
    localStorage.removeItem('token')
    dispatch(setToken(''))
    navigate('/')
  }

  return (
    <div className="navbar">
      <Link to='/'><img src={assets.logo} alt="" className="logo" /></Link>
      <ul className="navbar-menu">
        <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>home</Link>
        <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>menu</a>
        <a href='#app-download' onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>mobile-app</a>
        <a href='#footer' onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>contact us</a>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />
        <div className="navbar-search-icon">
          <Link to='/cart'>
            <img src={assets.basket_icon} alt="" />
          </Link>
          <div className={cartAmount === 0 ? '' : 'dot'}></div>
        </div>
        {!token 
          ? <button onClick={() => setShowLogin(true)}>sign in</button>
          : <div className="navbar-profile">
              <img src={assets.profile_icon} alt="" />
              <ul className="navbar-profile-dropdown">
                <li onClick={() => navigate('/myorders')}><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
                <hr />
                <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
              </ul>
          </div>
        }
      </div>
    </div>
  )
}

export default Navbar
