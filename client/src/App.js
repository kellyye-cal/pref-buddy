import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

import Home from './elements/Home'
import JudgeProfile from './elements/JudgeProfile'
import Judges from './elements/Judges'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route path="/judges" element={<Judges />}/>
        <Route path='/judges/JudgeProfile/:id' element={<JudgeProfile />} />
      </Routes>
    </BrowserRouter>
  //  <h1> hello world</h1>
  );
}

export default App;
