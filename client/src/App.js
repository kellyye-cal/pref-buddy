import React, {useContext, useEffect} from 'react'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from './api/axios'

import AuthContext from './context/AuthProvider'
import Register from './elements/Auth/Register'
import Login from './elements/Auth/Login'

import Home from './elements/Home'
import JudgeProfile from './elements/Judges/JudgeProfile'
import Judges from './elements/Judges/Judges'

import Rating from './elements/Judges/Rating'


function App() {
  const {auth, setAuth} = useContext(AuthContext);

  const ProtectedRoute = ({children}) => {
    if (!auth?.accessToken) {
      return <Navigate to="/" replace />
    }
    return children;
  };

  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        // Send a request to refresh the access token
        const response = await axios.post('/auth/refresh', {}, {
          withCredentials: true, // Send cookies with the request
        });

        // Extract the new access token from the response
        const newAccessToken = response.data.accessToken;

        // Set the new access token in the Auth context or state
        setAuth((prevState) => ({
          ...prevState,
          accessToken: newAccessToken,
        }));
      } catch (err) {
        // Handle errors (e.g., no refresh token or failed refresh)
        console.error("Error refreshing access token:", err);
        // You might want to log the user out or show an error
      }
    };

    // Check if there is a valid access token or attempt to refresh it
    refreshAccessToken();
  }, [setAuth]);

  return (
    <BrowserRouter>
      <Routes>
        {/* <Route exact path='/' element={<Home />} /> */}
        <Route exact path='/' element={<Register />} />
        <Route path='/login' element={<Login />}/>

        <Route
          path="/home/:userID"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
        <Route path="/judges" element={<Judges />}/>
        <Route path='/judges/JudgeProfile/:id' element={<JudgeProfile />} />
      </Routes>
    </BrowserRouter>
  //  <h1> hello world</h1>
  );
}

export default App;
