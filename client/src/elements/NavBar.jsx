import React, { useEffect, useState, useContext } from 'react';
import {NavLink, useParams} from "react-router-dom";
import axios from 'axios'
import '../App.css';

import Logout from './Auth/Logout';
import AuthContext from '../context/AuthProvider';

function NavBar() {
    const {auth} = useContext(AuthContext);

    const styles = {
        "menuSection": {
            "fontSize": "11pt",
            "fontWeight": 600,
            "color": "#717171",
            "marginBottom": 0
        }
    }
    return (
        <div id="navbar">
            <div id="logo"> Pref Buddy </div>
            <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to={`/home/${auth.userId}`}> Home </NavLink>
            {/* <NavLink activeClassName='active'> Settings </NavLink> */}

            <hr className="nav-line" style={{padding: 0}}/>

            <p style={styles.menuSection}> Prefs </p>
            <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to="/judges"> Judges </NavLink>
            <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to="/tournaments"> Tournaments </NavLink>

            <hr className="nav-line" style={{padding: 0}}/>

            <p style={styles.menuSection}> Settings </p>
            {(auth.admin === 1) ? <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to="/register"> Create Accounts </NavLink> : <div />}
            <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to="/logout"> Logout </NavLink>
            
        </div>
    )
}

export default NavBar;