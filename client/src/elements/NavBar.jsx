import React, { useEffect, useState, useContext } from 'react';
import {NavLink, useParams} from "react-router-dom";
import axios from 'axios'
import '../App.css';

import Logout from './Auth/Logout';
import AuthContext from '../context/AuthProvider';

function NavBar() {
    const {auth} = useContext(AuthContext);
    return (
        <div id="navbar">
            <NavLink activeClassName='active' to={`/home/${auth.userId}`}> Home </NavLink>
            {/* <NavLink activeClassName='active'> Settings </NavLink> */}

            <NavLink activeClassName='active' to="/judges"> Judges </NavLink>
            <NavLink activeClassName='active' to="/tournaments"> Tournaments </NavLink>

            <NavLink activeClassName='active' to="/logout"> Logout </NavLink>
        </div>
    )
}

export default NavBar;