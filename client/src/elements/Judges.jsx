import React, { useEffect, useState } from 'react';
import {Link, useParams} from "react-router-dom";
import axios from 'axios'
import '../App.css';

import NavBar from './NavBar'
import JudgePreview from './JudgePreview'

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
        .catch((err)=>console.log("rating get request error : ", err))
    }, [userID]);

    return (
        <div class="page">
            <NavBar />
            <div class="main">
                <h1> Judges </h1>
                <div>
                    {allJudges && allJudges.length > 0 ? (
                        allJudges.map((judge, index) => (
                            <div key={index}><JudgePreview judge={judge} userID={userID} /> </div>
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