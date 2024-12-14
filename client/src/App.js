import React, {useContext} from 'react'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

import AuthContext from './context/AuthProvider'
import Register from './elements/Auth/Register'
import Login from './elements/Auth/Login'

import Home from './elements/Home'
import JudgeProfile from './elements/Judges/JudgeProfile'
import Judges from './elements/Judges/Judges'

import Rating from './elements/Judges/Rating'


function App() {
  const {auth} = useContext(AuthContext);

  const ProtectedRoute = ({children}) => {
    if (!auth?.accessToken) {
      return <Navigate to="/" replace />
    }
    return children;
  };

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
