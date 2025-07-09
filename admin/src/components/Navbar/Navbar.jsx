import React from 'react'
import './navbar.scss'
import { assets } from '../../assets/admin_assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../../redux/authReducer'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="navbar">
      <NavLink to={"/"} className='logo-link'>
        <img src={assets.logo} alt="" className="logo" />
      </NavLink>
      <img src={assets.profile_image} alt="" className="profile" />
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Navbar
