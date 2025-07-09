import React from 'react'
import './explore-menu.scss'
import { menu_list } from '../../assets/frontend_assets/assets'
import { useSelector } from 'react-redux'
import Skeleton from '../Skeleton/Skeleton'

const ExploreMenu = ({category, setCategory}) => {

  const isLoading = useSelector((state) => state.food.isLoading);
  
  return (
    <div className="explore-menu" id='explore-menu' >
      <h1>Explore our menu</h1>
      <p className="explore-menu-text">
        Choose from a diverse menu featuring a delectable array 
        of dishes crafted with the finest ingredients and culinary 
        expertise. Our mission is to satisfy your cravings and 
        elevate your dining experience, one delicious meal at a time.
      </p>
      {isLoading ? ( 
        <Skeleton type="explore_menu" />
      ) : (
        <div className="explore-menu-list">
          {menu_list.map((item, index) => {
            return (
              <div onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)} key={index} className="explore-menu-list-item">
                <img src={item.menu_image} alt="" className={category === item.menu_name ? "active" : ""} />
                <p>{item.menu_name}</p>   
              </div>
            )
          })}
        </div>
      )}
      <hr />
    </div>
  )
}

export default ExploreMenu
