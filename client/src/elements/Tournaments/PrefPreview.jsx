import React, {useContext, useState, useRef} from "react";
import { Link } from "react-router-dom";

import AuthContext from "../../context/AuthProvider";
import axios from "../../api/axios";

import Rating from "../Judges/Rating";
import EditRating from "../Judges/EditRating";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faChevronDown} from '@fortawesome/free-solid-svg-icons'

function PrefPreview({judgeData, updateFunc}) {
    const {auth, setAuth} = useContext(AuthContext)
    const [isExpanded, setIsExpanded] = useState(false)
    const contentRef = useRef(null);
    const prevRef = useRef(null);

    const toggleContainer = () => {
        setIsExpanded(!isExpanded);
    }

    console.log(judgeData)

 return (
    <div>
        <div class="judgePreview">
            <div style={{
                overflow: 'hidden',
                transition: 'max-height 0.3s ease-out',
                maxHeight: isExpanded ? `${contentRef.current.scrollHeight}px` : `${prevRef?.current?.scrollHeight}px`, // Adjust to fit preview content height
                width: "100%"
            }}>
                <div ref={contentRef}>
                    <div className="h-between" style={{alignItems: "center"}} ref={prevRef}>
                        <div style={{display:'flex'}}>
                            <div class="ratingContainer">
                                <Rating rating={judgeData.rating}/>

                                <EditRating userID={auth.userId} judgeID={judgeData.j_id} updateFunc={updateFunc} currRating={judgeData.rating}/>
                            </div>
                            <div style={{marginLeft: 20}}>
                                <Link to={`/judges/JudgeProfile/${judgeData.id}`} class="judgePrevName" style={{marginBottom: 2}}> {judgeData.name} </Link>
                                <p className="judgePrevAffiliation"> {judgeData.affiliation}</p>
                            </div>
                        </div>

                        <button onClick={toggleContainer} style={{color: "#444", backgroundColor: "transparent", transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg'}}>
                            <FontAwesomeIcon icon={faChevronDown} />
                        </button>
                    </div>

                    <div className="prefPrevExpand">
                        <p> <span style={{fontWeight: 600}}> {judgeData.yrs_judge} years </span> judging | <span style={{fontWeight: 600}}> {judgeData.yrs_dbt} years </span> in debate </p>

                        <div>
                            <p style={{fontWeight: 600}}> My Notes </p>
                            <p> -- </p>
                        </div>

                        <div>
                            <p style={{fontWeight: 600}}> Paradigm</p>
                            <p> {judgeData.paradigm} </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
 )
}

export default PrefPreview;