import React, {useContext, useEffect} from 'react'
import {BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate} from 'react-router-dom'
import axios, { useAxiosInterceptors } from './api/axios'

import AuthContext from './context/AuthProvider'
import Register from './elements/Auth/Register'
import Login from './elements/Auth/Login'
import Logout from './elements/Auth/Logout'

import Home from './elements/Home'
import JudgeProfile from './elements/Judges/JudgeProfile'
import Judges from './elements/Judges/Judges'
import Tournaments from './elements/Tournaments/Tournaments'
import TournPage from './elements/Tournaments/TournPage'
import CreateAccount from './elements/Auth/CreateAccounts'
import AppRoutes from './AppRoutes'


function App() {
  useAxiosInterceptors();

  const {auth, setAuth} = useContext(AuthContext);


  useEffect(() => {
    const storedAccessToken = sessionStorage.getItem('accessToken');
    const storedUserId = sessionStorage.getItem('userId');
    const storedName = sessionStorage.getItem('name');

    if (storedAccessToken && storedUserId) {
        setAuth({
            accessToken: storedAccessToken,
            userId: storedUserId,
            loggedOut: false,
            name: storedName
        });
        console.log('setting auth by retrieving from session storage', storedAccessToken)
    } else if (auth?.loggedOut || !auth?.accessToken) {
      return
    } else if (!auth?.loggedOut && auth.accessToken) {

    }
  }, [setAuth]);

  useEffect(() => {
    const refreshAccessToken = async () => {
      console.log(auth)
      if (auth?.loggedOut || !auth?.accessToken) {
        return;
      }

      try {
        const response = await axios.post('/api/auth/refresh', {}, {
          withCredentials: true, // Send cookies with the request
        });

        const newAccessToken = response.data.accessToken;

        if (newAccessToken !== auth.accessToken) {
          setAuth((prev) => ({ ...prev, accessToken: newAccessToken, loggedOut: false, admin: response.data.admin }));
          console.log("access token being refreshed", auth, newAccessToken)

          sessionStorage.setItem('accessToken', newAccessToken);
        }
      } catch (err) {
        console.error("Error refreshing access token:", err);
      }
    }

    if (auth?.accessToken) {
      refreshAccessToken();
    }

  }, [auth?.loggedOut, setAuth]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
