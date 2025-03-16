import React from "react";
import { Link } from "react-router-dom";

import "./public.css"
import TopNav from "./TopNav";

function Public() {
    return (
        <div>
            <TopNav />
            <div className="main">
                <h1> Welcome to <span style={{color: "#373C58"}}>Pref</span><span style={{color: "#729AF0"}}>Buddy</span>! </h1>
            </div>
        </div>
    )
}

export default Public;