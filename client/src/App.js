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
    const storedAccessToken = sessionStorage.getItem('accessToken');
    const storedUserId = sessionStorage.getItem('userId');
    
    console.log('Stored Access Token:', storedAccessToken);
    console.log('Stored UserId:', storedUserId);

    if (storedAccessToken && storedUserId) {
        setAuth({
            accessToken: storedAccessToken,
            userId: storedUserId
        });
        console.log('setting auth by retrieving from session storage', storedAccessToken)
    }
  }, [setAuth]);

  useEffect(() => {
    const refreshAccessToken = async () => {
      if (!auth?.accessToken) {
        try {
          const response = await axios.post('/auth/refresh', {}, {
            withCredentials: true, // Send cookies with the request
          });

          const newAccessToken = response.data.accessToken;

          setAuth((prev) => ({ ...prev, accessToken: newAccessToken }));
          console.log("access token being refreshed", newAccessToken)

          sessionStorage.setItem('accessToken', newAccessToken);
        } catch (err) {
          console.error("Error refreshing access token:", err);
        }
      };
    }

    refreshAccessToken();

  }, [auth?.accessToken, setAuth]);

  return (
    <BrowserRouter>
      <Routes>
        {/* <Route exact path='/' element={<Home />} /> */}
        <Route
          path="/home/:userID"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />

        <Route path="/login" element={auth.accessToken ? <Navigate to={`/home/${auth.userId}`} /> : <Login />} />
        <Route path='/register' element={<Register />}/>

        <Route exact path='/' element={auth.accessToken ? <Navigate to={`/home/${auth.userId}`} /> : <Navigate to="/login" />} />

        <Route path="/judges" element={<Judges />}/>
        <Route path='/judges/JudgeProfile/:id' element={<JudgeProfile />} />
      </Routes>
    </BrowserRouter>
  //  <h1> hello world</h1>
  );
}

export default App;
