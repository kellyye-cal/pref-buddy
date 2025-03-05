import React, {useContext, useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faArrowUpRightFromSquare, faPen} from "@fortawesome/free-solid-svg-icons";

import Rating from "./Judges/Rating";
import EditRating from "./Judges/EditRating";
import JudgeNotes from "./Judges/JudgeNotes"

import AuthContext from "../context/AuthProvider";
import { Link } from "react-router-dom";

import ReactMarkdown from 'react-markdown';


const SidePanel = ({judgeData, updateFunc, closeFunc}) => {
    const {auth, setAuth} = useContext(AuthContext)
    const [editingNotes, setEditingNotes] = useState(false);


    return (
        <div className={`side-panel ${judgeData ? "open": ""}`}>
            <button onClick={closeFunc}>
                <FontAwesomeIcon icon={faTimes} style={{fontSize: 24}}/>
            </button>

            <div className="h-between" style={{alignItems: "center"}}>
                <div>
                    <Link to={`/judges/JudgeProfile/${judgeData.j_id}`} className="judgePanelName"> {judgeData.name} <FontAwesomeIcon icon={faArrowUpRightFromSquare} size="xs" style={{marginLeft: 4}}/></Link>
                    <div className="judgePanelAffil"> {judgeData.affiliation} </div>
                    </div>

                <div className="ratingContainer">
                    <Rating rating={judgeData.rating}/>

                    <EditRating userID={auth.userId} judgeID={judgeData.j_id} updateFunc={updateFunc} currRating={judgeData.rating}/>
                </div>
            </div>

            <div className="panel-container"> 
                <div className="h-between" style={{alignItems: "center"}}>
                <h5> Notes </h5>
                    <button className={`edit-button ${editingNotes ? "hidden" : ""}`}
                            style={{marginBottom: 8}}
                            onClick={() => {setEditingNotes(true)}}>
                        <FontAwesomeIcon icon={faPen} size="xs"/> Edit
                    </button>
                </div>
                <JudgeNotes judgeId={judgeData.j_id} editing={editingNotes} setEditing={setEditingNotes}/>
            </div>

            <div className="panel-container"> 
                <h5> Paradigm </h5>
                <ReactMarkdown children={judgeData.paradigm}/>
            </div>
        </div>
    )
}

export default SidePanel;