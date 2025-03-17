import React from "react";
import { NavLink } from "react-router-dom";

function TopNav() {
    return (

        <div className="top-nav">
            <NavLink to="/public" id="logo"> <span style={{color: "#373C58"}}>Pref</span><span style={{color: "#729AF0"}}>Buddy</span> </NavLink>

            <div>
                <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to="/public/tournaments"> Tournaments </NavLink>
                <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to="/public/judges"> Judges </NavLink>
                <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to="/login"> Login </NavLink>
            </div>
        </div>

    )
}

export default TopNav;