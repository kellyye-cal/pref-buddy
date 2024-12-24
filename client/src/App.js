import React, {useContext, useEffect} from 'react'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
// import 'bootstrap/dist/css/bootstrap.min.css';
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


function App() {
  useAxiosInterceptors();

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

    if (storedAccessToken && storedUserId) {
        setAuth({
            accessToken: storedAccessToken,
            userId: storedUserId,
            loggedOut: false
        });
        console.log('setting auth by retrieving from session storage', storedAccessToken)
      }
    // } else {
    //     setAuth({email: null, accessToken: null, userId: null});
    // }
  }, [setAuth]);

  useEffect(() => {
    console.log(auth)
    const refreshAccessToken = async () => {
      if (auth?.loggedOut || !auth?.accessToken) {
        return;
      }

      try {
        const response = await axios.post('/api/auth/refresh', {}, {
          withCredentials: true, // Send cookies with the request
        });

        const newAccessToken = response.data.accessToken;

        if (newAccessToken !== auth.accessToken) {
          setAuth((prev) => ({ ...prev, accessToken: newAccessToken, loggedOut: false }));
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
      <Routes>
        <Route
          path="/home/:userID"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />

        <Route path="/login" element={auth.accessToken ? <Navigate to={`/home/${auth.userId}`} /> : <Login />} />
        <Route path='/register' element={<Register />}/>
        <Route path='logout' element={<Logout />} />

        <Route exact path='/' element={auth.accessToken ? <Navigate to={`/home/${auth.userId}`} /> : <Navigate to="/login" />} />

        <Route path="/judges" element={auth.accessToken ? <ProtectedRoute> <Judges />  </ProtectedRoute> : <Navigate to="/login" />}/>
        <Route path='/judges/JudgeProfile/:id' element={auth.accessToken ? <ProtectedRoute> <JudgeProfile /> </ProtectedRoute> : <Navigate to="/login" />} />

        <Route path="/tournaments" element={auth.accessToken ? <ProtectedRoute> <Tournaments />  </ProtectedRoute> : <Navigate to="/login" />}/>
        <Route path='/tournaments/:tournId' element={auth.accessToken ? <ProtectedRoute> <TournPage /> </ProtectedRoute> : <Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  //  <h1> hello world</h1>
  );
}

export default App;
