import React from "react";
import { NavLink, Link } from "react-router-dom";

function TopNav() {
    return (

        <div className="top-nav">
            <NavLink to="/public" id="logo"> <span style={{color: "#373C58"}}>Pref</span><span style={{color: "#729AF0"}}>Buddy</span> </NavLink>

            <div>
                <Link to="/public/tournaments"> Tournaments </Link>
                <Link to="/public/judges"> Judges </Link>
                <Link to="/login"> Login </Link>
            </div>
        </div>

    )
}

export default TopNav;