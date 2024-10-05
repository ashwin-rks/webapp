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
import Profile from './Components/ProfileComponents/Profile';

// Admin Components
import Home from './Components/ProfileComponents/AdminComponents/Home';
import Departments from './Components/ProfileComponents/AdminComponents/Departments';
import Skills from './Components/ProfileComponents/AdminComponents/Skills';
import Course from './Components/ProfileComponents/AdminComponents/Course';
import User from './Components/ProfileComponents/AdminComponents/User';


// User Components
import UserCourses from './Components/ProfileComponents/UserComponents/UserCourses';
import UserSkills from './Components/ProfileComponents/UserComponents/UserSkills';

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
    path: "/admin",
    element: <PrivateRoute component={Dashboard} adminOnly={true} />,
    children: [
      {
        index: true, 
        element: <Navigate to="home" />, 
      },
      {
        path: "home",
        element: <Home />
      },
      {
        path: "department",
        element: <Departments />, 
      },
      {
        path: "skills",
        element: <Skills />
      },
      {
        path: "courses",
        element: <Course />
      },
      {
        path: "users",
        element: <User />
      },
      {
        path: 'profile',
        element: <Profile />
      }
    ]
  },
  {
    path: "/user",
    element: <PrivateRoute component={Dashboard} />,
    children: [
      {
        path: 'courses',
        element: <UserCourses />
      },
      {
        path: 'skills',
        element: <UserSkills />
      },
      {
        path: 'profile',
        element: <Profile />
      }
    ]
  }
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