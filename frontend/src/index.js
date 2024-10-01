import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import './index.css';

// Auth Components
import Login from './Components/AuthComponents/Login';
import Signup from './Components/AuthComponents/Signup';
import PrivateRoute from './Components/PrivateRoute';

// Profile Components
import Dashboard from './Components/ProfileComponents/Dashboard';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/home",
    element: <PrivateRoute component={Dashboard} />,
  },
  // {
  //   path: "*",
  //   element: <ErrorBoundary />,
  // },
]);


ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
    <ToastContainer /> 
  </AuthProvider>
);