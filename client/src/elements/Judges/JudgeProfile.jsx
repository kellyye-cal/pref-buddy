import React, { useEffect, useState, useContext } from 'react';
import {useParams} from "react-router-dom";
import axios from '../../api/axios';
import '../../App.css';
import './JudgeProfile.css';

import NavBar from '../NavBar'
import Rating from './Rating'
import EditRating from './EditRating';
import AuthContext from '../../context/AuthProvider';
import JudgeNotes from './JudgeNotes';

import ReactMarkdown from 'react-markdown';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";


function JudgeProfile() {
    const {auth, setAuth} = useContext(AuthContext);

    const [judgeData, setJudgeData] = useState([]); //to store fetched data
    const [paradigm, setParadigm] = useState(["No paradigm."]);

    const [editingNotes, setEditingNotes] = useState(false);
    const [judgeNotes, setJudgeNotes] = useState(["..."])

    const { id } = useParams();

    useEffect(()=>{
        axios.get(`/api/judges/${id}`, {params:{u_id: auth.userId}, headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
        }}).then((res) => {
            setJudgeData(res.data.judgeInfo);

            setParadigm(res.data.paradigm)

            setJudgeNotes(res.data.judgeInfo[0].notes)
        })
        .catch((err)=>console.log(err))
    }, []);

    function updateRating(judgeID, newRating) {
        axios.post(`/api/judges/set_rating`, {
            u_id: auth.userId,
            j_id: judgeID,
            rating: newRating
        }, {headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
        }}).then(() => {
            setJudgeData(prevJudges => prevJudges.map(judge => 
                judge.id === judgeID ? {...judge, rating: newRating} : judge
            ));
        }).catch((err) => console.error("Error saving rating:", err));

        axios.get(`/api/judges/${id}`, {params:{u_id: auth.userId}, headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
        }}).then((res) => {
            setJudgeData(res.data);
        })
        .catch((err)=>console.log(err))
    }

    return (
        <div className="page">
            <NavBar />
            <div className="main">
                <div>
                    {judgeData && judgeData.length > 0 ? (
                        judgeData.map((judge, index) => (
                            <div>
                                <div className="judgeProfTitle">
                                    <div>
                                        <h1> {judge.name} </h1>
                                        <h4> {judge.affiliation}</h4>
                                    </div>

                                    <div className="ratingContainer">
                                        <Rating rating={judge.rating}/>

                                        <EditRating userID={auth.userId} judgeID={judge.judge_id} updateFunc={updateRating} currRating={judge.rating}/>

                                    </div>
                                </div>

                                <div className="h-between" style={{gap: 12, alignItems: "stretch"}}>
                                    <div className="container-spacing container">
                                        <h3 style={{margin: 0}}> Stats </h3>

                                        <div className="h-between" style={{marginTop: 8, marginBottom: 8, flexWrap: "wrap", gap: 8}}>
                                            <div className="stat-instance">
                                                <h5> Years Judging </h5>
                                                <p className="stat-text"> {judge.yrs_judge} </p>
                                            </div>

                                            <div className="stat-instance">
                                                <h5> Years in Debate </h5>
                                                <p className="stat-text"> {judge.yrs_dbt} </p>
                                            </div>

                                            <div className="stat-instance">
                                                <h5> Speaker Pt Avg </h5>
                                                <p className="stat-text"> -- </p>
                                            </div>
                                        </div>

                                        <div style={{marginTop: 8, marginBottom: 8}}>
                                        <div className="stat-instance">
                                                <h5> 24-25 Topic Round Stats </h5>
                                                <p className="stat-text"> <span> Policy v. Policy: </span> -- </p>
                                                <p className="stat-text"> <span> Policy v. K: </span> -- </p>
                                                <p className="stat-text"> <span> Clash: </span> -- </p>
                                                <p className="stat-text"> <span> K v. K: </span> -- </p>
                                                <p className="stat-text"> <span> T/Theory: </span> -- </p>

                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="container container-spacing">
                                        <div className="h-between" style={{alignItems: "center"}}>
                                            <h3> Notes </h3>
                                            <button className={`edit-button ${editingNotes ? "hidden" : ""}`}
                                                    style={{marginBottom: 8}}
                                                    onClick={() => {setEditingNotes(true)}}>
                                                <FontAwesomeIcon icon={faPen} size="xs"/> Edit
                                            </button>
                                        </div>
                                        <JudgeNotes judgeId={id} notes={judgeNotes} setEditing={setEditingNotes} editing={editingNotes}/>
                                    </div>
                                </div>

                                <div className="container container-spacing">
                                    <h3> Paradigm </h3>
                                    <div className="v-scroll"> <ReactMarkdown children={paradigm}/> </div> 
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>
                            <p> Loading... </p>
                        </div>

                    )}
                </div>

            </div>
        </div>
    )
}

export default JudgeProfile;