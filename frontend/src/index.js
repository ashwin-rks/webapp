import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import { AuthProvider } from "./Context/AuthContext";
import './index.css';

// Auth Components
import Login from './Components/AuthComponents/Login';
import Signup from './Components/AuthComponents/Signup';
import PrivateRoute from './Components/PrivateRoute';

// Profile Components
import Dashboard from './Components/ProfileComponents/Dashboard';

// Admin Compnents
import Departments from './Components/ProfileComponents/AdminComponents/Departments';
import Skills from './Components/ProfileComponents/AdminComponents/Skills';


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
    children: [
      {
        path: "department",
        element: <Departments />, 
      },
      {
        path: "skills",
        element: <Skills />
      }
    ]
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