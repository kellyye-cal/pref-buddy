import React, {useContext} from "react";
import { Link } from "react-router-dom";

import AuthContext from "../../context/AuthProvider";
import axios from "../../api/axios";

import Rating from "../Judges/Rating";
import EditRating from "../Judges/EditRating";

function PrefPreview({judgeData, updateFunc}) {
    const {auth, setAuth} = useContext(AuthContext)

 return (
    <div>
        <div class="judgePreview">
                    <div style={{display:'flex'}}>
                        <div class="ratingContainer">
                            <Rating rating={judgeData.rating}/>

                            <EditRating userID={auth.userId} judgeID={judgeData.j_id} updateFunc={updateFunc} currRating={judgeData.rating}/>
                        </div>
                        <div style={{marginLeft: 20}}>
                            <Link to={`/judges/JudgeProfile/${judgeData.id}`} class="judgePrevName" style={{marginBottom: 2}}> {judgeData.f_name + " " + judgeData.l_name} </Link>
                            <p style={{fontSize:16, color: '#6a6a6a', marginBottom: 0}}> {judgeData.affiliation}</p>
                        </div>
                    </div>
                </div>
    </div>
 )
}

export default PrefPreview;