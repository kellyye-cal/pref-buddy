import React from 'react';
import {Link} from "react-router-dom";
import '../../App.css';

import Rating from './Rating'
import EditRating from './EditRating'


function JudgePreview({judge, userID, updateFunc}) {
    return (
        <div>
            {judge ? (
                <div className="judgePreview">
                    <div style={{display:'flex', alignItems:'center'}}>
                        <div className="ratingContainer">
                            <Rating rating={judge.rating}/>

                            <EditRating userID={userID} judgeID={judge.id} updateFunc={updateFunc} currRating={judge.rating}/>

                        </div>
                        <div style={{marginLeft: 20}}>
                            <Link to={`/judges/JudgeProfile/${judge.id}`} className="judgePrevName"> {judge.name} </Link>
                            <p className="judgePrevAffiliation"> {judge.affiliation}</p>


                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}
            
        </div>
    )
}

export default JudgePreview;