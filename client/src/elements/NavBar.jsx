import React, { useEffect, useState } from 'react';
import {NavLink, useParams} from "react-router-dom";
import axios from 'axios'
import '../App.css';

function NavBar() {
    return (
        <div id="navbar">
            <NavLink activeClassName='active' to="/"> Home </NavLink>
            <NavLink activeClassName='active' to="/JudgeProfile/0"> Kelly Ye</NavLink>
        </div>
    )
}

export default NavBar;