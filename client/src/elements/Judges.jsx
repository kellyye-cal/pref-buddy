import React, { useEffect, useState } from 'react';
import {Link, useParams} from "react-router-dom";
import axios from 'axios'
import '../App.css';

import NavBar from './NavBar'
import JudgePreview from './JudgePreview'
import Search from './Search'

function Judges({userID}) {
    const [allJudges, setData] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);

    userID = 0

    useEffect(()=>{
        axios.get(`http://localhost:4000/api/alljudges`,
        {params:{
            u_id: userID
        }}
        ).then((res) => {
            setData(res.data);
            setFilteredRecords(res.data)
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

        axios.get(`http://localhost:4000/api/alljudges`,
            {params:{
                u_id: userID
            }}
            ).then((res) => {
                setData(res.data);
                setFilteredRecords(res.data)
            })
            .catch((err)=>console.log("Error getting all judges: ", err))
    }


    return (
            <div class="page">
                <NavBar />
                <div class="main">
                    <h1> Judges </h1>
                    <Search data={allJudges} keys={['name', 'affiliation']} onFilteredRecordChange={setFilteredRecords}> </Search>
                    <div>
                        {allJudges && allJudges.length > 0 ? (
                            filteredRecords.map((judge, index) => (
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