import React from 'react'
import './footer.scss'
import { assets } from '../../assets/frontend_assets/assets'

const Footer = () => {
  return (
   <div className="footer" id='footer'>
    <div className="footer-content">
      <div className="footer-content-left">
        <img src={assets.logo} alt="" />
        <p>Craving something delicious? Our restaurant makes it easy 
          to enjoy your favorite meals from the comfort of your home. 
          Simply browse our diverse menu, select your dishes, and place 
          your order. We're committed to delivering fresh, high-quality 
          food straight to your door, ensuring a delightful dining 
          experience every time.
        </p>
        <div className="footer-social-icons">
          <img src={assets.facebook_icon} alt="" />
          <img src={assets.twitter_icon} alt="" />
          <img src={assets.linkedin_icon} alt="" />
        </div>
      </div>
      <div className="footer-content-center">
        <h2>COMPANY</h2>
        <ul>
          <li>Home</li>
          <li>About us</li>
          <li>Delivery</li>
          <li>Privacy policy</li>
        </ul>
      </div>
      <div className="footer-content-right">
        <h2>GET IN TOUCH</h2>
        <ul>
          <li>+1-313-577-3215</li>
          <li>food4u@gmail.com</li>
        </ul>
      </div>
    </div>
    <hr />
    <p className="footer-copyright">Copyright 2025 © Food4U.com - All Right Reserved</p>
   </div>
  )
}

export default Footer
