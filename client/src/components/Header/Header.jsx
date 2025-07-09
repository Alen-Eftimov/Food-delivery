import React from 'react'
import './header.scss'
import { useSelector } from 'react-redux';
import Skeleton from '../Skeleton/Skeleton';

const Header = () => {

  const isLoading = useSelector((state) => state.food.isLoading);

  return (
    <>
      {isLoading ? ( 
        <Skeleton type="header"/>
      ) : (
        <div className="header">
          <div className="header-contents">
            <h2>Order your favourite food here</h2>
            <p>Choose from a diverse menu featuring a delectable array 
              of dishes crafted with the finest ingredients and culinary 
              expertise. Our mission is to satisfy your cravings and 
              elevate your dining experience, one delicious meal at a time.
            </p>
            <a href="#explore-menu" className="header-contents-link">
              <button>View Menu</button>
            </a>
          </div>
        </div>
      )}
    </>
  )
}

export default Header


