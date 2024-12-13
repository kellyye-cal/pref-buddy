import React, { useEffect, useState, useNavigate } from 'react';
import {Link, useParams} from "react-router-dom";
import axios from 'axios'
import '../App.css';

import Rating from './Rating'
import EditRating from './EditRating'


function JudgePreview({judge, userID, updateFunc}) {
    console.log(judge)
    return (
        <div>
            {judge ? (
                <div class="judgePreview">
                    <div style={{display:'flex'}}>
                        <div class="ratingContainer">
                            <Rating rating={judge.rating}/>

                            <EditRating userID={userID} judgeID={judge.id} updateFunc={updateFunc} currRating={judge.rating}/>

                        </div>
                        <div style={{marginLeft: 20}}>
                            <Link to={`/judges/JudgeProfile/${judge.judge_id}`} class="judgePrevName" style={{marginBottom: 2}}> {judge.name} </Link>
                            <p style={{fontSize:16, color: '#6a6a6a', marginBottom: 0}}> {judge.affiliation}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div></div>
            )}
            
        </div>
    )
}

export default JudgePreview;