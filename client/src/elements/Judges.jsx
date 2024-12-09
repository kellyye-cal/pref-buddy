import React, { useEffect, useState } from 'react';
import {Link, useParams} from "react-router-dom";
import axios from 'axios'
import '../App.css';

import NavBar from './NavBar'
import JudgePreview from './JudgePreview'
import Toggle from './Toggle'

function Judges({userID}) {
    const [allJudges, setData] = useState([]); //to store fetched data

    userID = 0

    useEffect(()=>{
        axios.get(`http://localhost:4000/api/alljudges`,
        {params:{
            u_id: userID
        }}
        ).then((res) => {
            setData(res.data);
        })
        .catch((err)=>console.log("Error getting all judges: ", err))
    }, [userID]);

    const updateRating = (judgeID, newRating) => {
        axios.post(`http://localhost:4000/api/set_rating/`, {
            u_id: userID,
            j_id: judgeID,
            rating: newRating
        }).then(() => {
            setData(prevJudges => prevJudges.map(judge => 
                judge.id === judgeID ? {...judge, rating: newRating} : judge
            ));
        }).catch((err) => console.error("Error saving rating:", err));
    }

    return (
            <div class="page">
                <NavBar />
                <div class="main">
                    <h1> Judges </h1>
                    <Toggle leftText="My Ratings" rightText="All Judges"/>
                    <div>
                        {allJudges && allJudges.length > 0 ? (
                            allJudges.map((judge, index) => (
                                <div key={index}><JudgePreview judge={judge} userID={userID} updateFunc={updateRating}/> </div>
                            ))
                        ) : (
                            <div></div>
                        )}
                    </div>
                </div>
            </div>
    )
}

export default Judges;