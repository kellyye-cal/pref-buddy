import React, {useContext} from 'react';
import {NavLink} from "react-router-dom";
import '../App.css';

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
            <NavLink to="/public" id="big-logo">
                <span style={{color: "#373C58"}}>Pref</span>
                <span style={{color: "#729AF0"}}><br/> Buddy</span>
            </NavLink>
            <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to={`/home/${auth.userId}`}> Dashboard </NavLink>
            {/* <NavLink activeClassName='active'> Settings </NavLink> */}

            <hr className="nav-line" style={{padding: 0}}/>

            <p style={styles.menuSection}> Prefs </p>
            {/* <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to="/judges"> Judges </NavLink> */}
            <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to="/tournaments"> Tournaments </NavLink>

            <hr className="nav-line" style={{padding: 0}}/>

            {auth.judge ?
                <div>
                    <p style={styles.menuSection}> Judging </p>
                    <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to={`/myprofile/${auth.userId}`}> My Profile </NavLink>
                    <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to={`/judgehistory/${auth.userId}`}> Past Judging </NavLink>
                    <hr className="nav-line" style={{padding: 0}}/>
                </div>
            :   <></>
            }
            <p style={styles.menuSection}> Settings </p>
            {(auth.admin === 1) ? <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to="/register"> Create Accounts </NavLink> : <div />}
            <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to="/logout"> Logout </NavLink>
            
        </div>
    )
}

export default NavBar;