import React, { useEffect, useState } from 'react';
import {useParams} from "react-router-dom";
import axios from 'axios'
import '../App.css';


function Rating({userID, judgeID}) {
    const [ratingData, setRating] = useState([]); //to store fetched data

    useEffect(()=>{
        axios.get(`http://localhost:4000/api/ratings`,
            {params: {
                u_id: userID,
                j_id: judgeID
            }}
        ).then((res) => {
            setRating(res.data);
        })
        .catch((err)=>console.log("rating get request error : ", err))
    }, [userID, judgeID]);

    
    if (ratingData && ratingData.length > 0) {
        const numRating = ratingData[0].rating
        var display = String(numRating);

        if (numRating === 0) {
            display = "-";
        } else if (numRating === 6) {
            display = "S";
        }
    }
    return (
        <div class={
            display === "1" ? "rating oneRate" :
            display === "2" ? "rating twoRate" :
            display === "3" ? "rating threeRate" :
            display === "4" ? "rating fourRate" :
            display === "5" ? "rating fiveRate" :
            display === "S" ? "rating strikeRate" :
            "rating noRate"
        }>
            {ratingData && ratingData.length > 0 ? (
                ratingData.map((rate, index) => (
                    <div> {display} </div>
                ))
            ) : (
                <div class="noRate rating"> - </div>
            )}
        </div>
    )
}

export default Rating;