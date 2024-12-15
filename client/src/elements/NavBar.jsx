import React, { useEffect, useState, useContext } from 'react';
import {NavLink, useParams} from "react-router-dom";
import axios from 'axios'
import '../App.css';

import AuthContext from '../context/AuthProvider';

function NavBar() {
    const {auth} = useContext(AuthContext);
    return (
        <div id="navbar">
            <NavLink activeClassName='active' to="/home/:userID"> Home </NavLink>
            {/* <NavLink activeClassName='active'> Settings </NavLink> */}

            <NavLink activeClassName='active' to="/judges"> Judges </NavLink>
        </div>
    )
}

export default NavBar;