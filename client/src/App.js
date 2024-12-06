import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

import Home from './elements/Home'
import JudgeProfile from './elements/JudgeProfile'
import NavBar from './elements/NavBar'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/JudgeProfile' element={<JudgeProfile />} />
      </Routes>
    </BrowserRouter>
  //  <h1> hello world</h1>
  );
}

export default App;
