import {createBrowserRouter, Outlet, RouterProvider} from 'react-router-dom';
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home.jsx'
import Cart from './pages/Cart/Cart.jsx';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder.jsx';
import Footer from './components/Footer/Footer.jsx';
import { useEffect, useState } from 'react';
import LoginPopup from './components/LoginPopup/LoginPopup.jsx';
import Verify from './pages/Verify/Verify.jsx';
import MyOrders from './pages/MyOrders/MyOrders.jsx';
import { useDispatch } from 'react-redux';
import { fetchFoodList } from './redux/foodSlice.js';
import { setToken } from './redux/authSlice.js';
import { loadCartData } from './redux/cartSlice.js';

const App = () => {

  const Layout = () => {

    const [showLogin, setShowLogin] = useState(false)
    const dispatch = useDispatch()
  
    useEffect(() => {
      dispatch(fetchFoodList())
  
      const tokenFromStorage = localStorage.getItem('token')
      if (tokenFromStorage) {
        dispatch(setToken(tokenFromStorage))
        dispatch(loadCartData(tokenFromStorage))
      }
    }, [dispatch])

    return (
      <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
        <div className="app">
          <Navbar setShowLogin={setShowLogin} />
          <Outlet />
        </div>
        <Footer />
      </>
    )
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: '/',
          element: <Home />
        },
        {
          path: '/cart',
          element: <Cart />
        },
        {
          path: '/order',
          element: <PlaceOrder />
        },
        {
          path: '/verify',
          element: <Verify />
        },
        {
          path: '/myorders',
          element: <MyOrders />
        }
      ]
    }
  ])
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App

