import React from "react";
import { NavLink } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons'

function Back({link}) {

    return (
        <NavLink to={link}>
            <div className="back">
                <FontAwesomeIcon icon={faArrowLeft} />
                <p> Back </p>
            </div>
        </NavLink>
    )
}

export default Back;