import React, {useContext} from "react";
import { NavLink } from "react-router-dom";

import AuthContext from '../../context/AuthProvider';


function TopNav() {
    const {auth} = useContext(AuthContext);

    return (

        <div className="top-nav">
            <NavLink to="/public" id="logo"> <span style={{color: "#373C58"}}>Pref</span><span style={{color: "#729AF0"}}>Buddy</span> </NavLink>

            <div>
                <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to="/public/tournaments"> Tournaments </NavLink>
                <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to="/public/judges"> Judges </NavLink>
                <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to="/contributions"> Contribute </NavLink>
                {auth.loggedOut ?
                    <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to="/login"> Login </NavLink>
                : auth.userId && !auth.loggedOut ?
                    <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to={`/myprofile/${auth.userId}`}> Dashboard </NavLink>
                :
                    <></>
                }
            </div>
        </div>

    )
}

export default TopNav;