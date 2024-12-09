import React, { useEffect, useState, useNavigate } from 'react';
import {Link, useParams} from "react-router-dom";
import axios from 'axios'
import '../App.css';

import Rating from './Rating'
import EditRating from './EditRating'


function JudgePreview({judge, userID}) {
    return (
        <div>
            {judge ? (
                <div class="judgePreview">
                    <div style={{display:'flex'}}>
                        <div class="ratingContainer">
                            <Rating userID={userID} judgeID={judge.judge_id}/>

                            <EditRating userID={userID} judgeID={judge.judge_id} />

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