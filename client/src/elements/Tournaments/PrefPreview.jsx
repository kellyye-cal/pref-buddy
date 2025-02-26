import React, {useContext, useState, useRef} from "react";
import { Link } from "react-router-dom";

import AuthContext from "../../context/AuthProvider";
import axios from "../../api/axios";

import Rating from "../Judges/Rating";
import EditRating from "../Judges/EditRating";
import SidePanel from "../SidePanel";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faChevronDown} from '@fortawesome/free-solid-svg-icons'

import ReactMarkdown from 'react-markdown';


function PrefPreview({judgeData, updateFunc, onSelect, isSelected}) {
    const {auth, setAuth} = useContext(AuthContext)

 return (
    <div>
        <div className="overlay-container">
            <div className="pref-overlay"> </div>

            <div className={`judgePreview ${isSelected ? "selected" : ""}`} onClick={() => onSelect(judgeData)}>
                <div className="h-between" style={{alignItems: "center"}}>
                    <div style={{display:'flex', alignItems:"center"}}>
                        <div className="ratingContainer">
                            <Rating rating={judgeData.rating}/>

                        </div>
                        <div style={{marginLeft: 20}}>
                            <div className="judgePrevName"> {judgeData.name} </div>
                            <p className="judgePrevAffiliation"> {judgeData.affiliation}</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
 )
}

export default PrefPreview;