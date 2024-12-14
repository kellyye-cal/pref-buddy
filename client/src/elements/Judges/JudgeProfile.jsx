import React, { useEffect, useState } from 'react';
import {useParams} from "react-router-dom";
import axios from 'axios'
import '../../App.css';
import './JudgeProfile.css';

import NavBar from '../NavBar'
import Rating from './Rating'
import EditRating from './EditRating';

function JudgeProfile() {
    let userID = 0;
    const [judgeData, setJudgeData] = useState([]); //to store fetched data
    const { id } = useParams();

    console.log(id)

    useEffect(()=>{
        axios.get(`http://localhost:4000/api/judge/${id}`, {params:{u_id: userID}}).then((res) => {
            setJudgeData(res.data);
        })
        .catch((err)=>console.log(err))
    }, []);

    function updateRating(judgeID, newRating) {
        axios.post(`http://localhost:4000/api/set_rating/`, {
            u_id: userID,
            j_id: judgeID,
            rating: newRating
        }).then(() => {
            setJudgeData(prevJudges => prevJudges.map(judge => 
                judge.id === judgeID ? {...judge, rating: newRating} : judge
            ));
        }).catch((err) => console.error("Error saving rating:", err));
        console.log(judgeData)
    }

    return (
        <div class="page">
            <NavBar />
            <div class="main">
                <div>
                    {judgeData && judgeData.length > 0 ? (
                        judgeData.map((judge, index) => (
                            <div>
                                <div class="judgeProfTitle">
                                    <div>
                                        <h1> {judge.name} </h1>
                                        <h4> {judge.affiliation}</h4>
                                    </div>

                                                                        <div class="ratingContainer">
                                        <Rating rating={judge.rating}/>

                                        <EditRating userID={userID} judgeID={judge.judge_id} updateFunc={updateRating} currRating={judge.rating}/>

                                    </div>
                                </div>

                                <div class="container-spacing container">
                                    <h3 style={{margin: 0}}> Stats </h3>

                                    <div class="h-between" style={{marginTop: 8, marginBottom: 8}}>
                                        <div class="stat-instance">
                                            <h5> Years Judging </h5>
                                            <p class="stat-text"> {judge.yrs_judge} </p>
                                        </div>

                                        <div class="stat-instance">
                                            <h5> Years in Debate </h5>
                                            <p class="stat-text"> {judge.yrs_dbt} </p>
                                        </div>

                                        <div class="stat-instance">
                                            <h5> Speaker Pt Avg </h5>
                                            <p class="stat-text"> -- </p>
                                        </div>
                                    </div>

                                    <div style={{marginTop: 8, marginBottom: 8}}>
                                    <div class="stat-instance">
                                            <h5> 24-25 Topic Round Stats </h5>
                                            <p class="stat-text"> -- </p>
                                        </div>
                                    </div>
                                </div>

                                <div class="history container container-spacing">
                                    <h3> Judge Information </h3>
                                    <p> {judge.paradigm} </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>
                            <p> failed to load resource </p>
                        </div>

                    )}
                </div>

            </div>
        </div>
    )
}

export default JudgeProfile;