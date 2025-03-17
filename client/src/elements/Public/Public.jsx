import React from "react";

import "./public.css"
import TopNav from "./TopNav";

function Public() {
    return (
        <div>
            <TopNav />
            <div className="public-main">
                <h1> Welcome to <span style={{color: "#373C58"}}>Pref</span><span style={{color: "#729AF0"}}>Buddy</span>! </h1>
                <p> This project</p>
            </div>
        </div>
    )
}

export default Public;