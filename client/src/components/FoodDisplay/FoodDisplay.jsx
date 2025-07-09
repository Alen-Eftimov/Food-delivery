import React from 'react'
import './food-display.scss'
import FoodItem from '../FoodItem/FoodItem'
import { useSelector } from 'react-redux'
import Skeleton from '../Skeleton/Skeleton';

const FoodDisplay = ({category}) => {
  
  const food_list = useSelector((state) => state.food.foodList)
  const isLoading = useSelector((state) => state.food.isLoading);

  return (
    <div className="food-display" id='food-display'>
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {isLoading ? ( 
          <Skeleton type="food_display"/>
        ) : (
          food_list.map((item, index) => {
            if (category === 'All' || category === item.category) {
              return (
                <FoodItem
                  key={index}
                  id={item.id}
                  name={item.name}
                  image={item.image}
                  price={item.price}
                  description={item.description}
                />
              );
            }
            return null;
          })
        )}
      </div>
    </div>
  );
};

export default FoodDisplay
