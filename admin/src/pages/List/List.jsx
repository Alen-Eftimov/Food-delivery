import React, { useCallback, useEffect, useState } from 'react'
import './list.scss'
import axios from 'axios'
import {toast} from 'react-toastify'

const List = ({url}) => {

  const [list, setList] = useState([])

  const fetchList = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error('Error fetching food list');
      }
    } catch (error) {
      console.error("Error fetching food list:", error);
      toast.error('An error occurred while fetching the food list');
    }
  }, [url]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const removeFood = async (foodId) => {
    try {
      const response = await axios.delete(`${url}/food/remove`, { data: { id: foodId } });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error removing food item:", error);
      toast.error("An error occurred while removing the food item.");
    }
  };
  
  return (
    <div className="list add flex-col">
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
      </div>
      {list.map((item, index) => (        
        <div  key={index} className="list-table-format">
          <img src={item.image} alt={item.name}/>
          <p>{item.name}</p>
          <p>{item.category}</p>
          <p>${item.price}</p>
          <p onClick={() => removeFood(item.id)} className='cursor'>X</p>
        </div>        
      ))}
    </div>
  )
}

export default List
