import React from 'react'
import {createBrowserRouter, Navigate, Outlet, RouterProvider} from 'react-router-dom';
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import Add from './pages/Add/Add';
import List from './pages/List/List';
import Orders from './pages/Orders/Orders';
import { ToastContainer } from 'react-toastify';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home.jsx';
import { useSelector } from 'react-redux';

const App = () => {

  let url = process.env.REACT_APP_URL
  const Layout = () => {

    return (
      <div>
        <ToastContainer />
        <Navbar />
        <hr />
        <div className="app-content">
          <Sidebar />
          <Outlet />
        </div>
      </div>
    )
  }


  const { isAuthenticated, role } = useSelector((state) => state.auth)
 
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated || role !== 'admin') {
      return <Navigate to='/login' replace/>
    }
    return children
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: '/',
          element: <Home />
        },
        {
          path: '/add',
          element: <Add url={url} />
        },
        {
          path: '/list',
          element: <List url={url} />
        },
        {
          path: '/orders',
          element: <Orders url={url} />
        }
      ]
    },
    {
      path: '/login',
      element: (isAuthenticated && role === 'admin'? <Navigate replace to={"/"} /> : <Login /> )
    }
  ])

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App








