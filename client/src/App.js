import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

import Register from './elements/Auth/Register'
import Login from './elements/Auth/Login'

import Home from './elements/Home'
import JudgeProfile from './elements/Judges/JudgeProfile'
import Judges from './elements/Judges/Judges'

import Rating from './elements/Judges/Rating'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route exact path='/' element={<Home />} /> */}
        <Route exact path='/' element={<Register />} />
        <Route path="/judges" element={<Judges />}/>
        <Route path='/judges/JudgeProfile/:id' element={<JudgeProfile />} />
      </Routes>
    </BrowserRouter>
  //  <h1> hello world</h1>
  );
}

export default App;
