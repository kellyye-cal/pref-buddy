import React, { useEffect, useState } from 'react';
import {Navigate, useNavigate, useParams} from "react-router-dom";
import axios from 'axios'
import '../App.css';


function EditRating({userID, judgeID}) {
    const [isEditing, setIsEditing] = useState(false);
    const [newRating, setNewRating] = useState(null)

    const openModal = () => setIsEditing(true);
    const closeModal = () => setIsEditing(false);

    function clickRating(event) {
        const newRatingID = event.target.id;

        let rating = null;

        if (newRatingID === 'unselectOption') {
            rating = null;
            event.target.style.backgroundColor = "#6a6a6a"
        } else if (newRatingID === "optionOne") {
            rating = 1;
            event.target.style.backgroundColor = "#148943"
        }  else if (newRatingID === "optionTwo") {
            rating = 2;
            event.target.style.backgroundColor = "#9DE06E"
            event.target.style.color = "#333"
        }  else if (newRatingID === "optionThree") {
            rating = 3;
            event.target.style.backgroundColor = "#FFD900"
            event.target.style.color = "#333"
        }  else if (newRatingID === "optionFour") {
            newRating = 4;
            event.target.style.backgroundColor = "#F3A72D"
            event.target.style.color = "#333"
        }  else if (newRatingID === "optionFive") {
            rating = 5;
            event.target.style.backgroundColor = "#FF7D38"
            event.target.style.color = "#333"
        }  else {
            rating = 6;
            event.target.style.backgroundColor = "#FF2A2A"
        }

        setNewRating(rating);

        const allButtons = Array.from(document.querySelector('.ratingButtons').children)
        
        allButtons.forEach(child => {
            if (child.id != newRatingID) {
                child.style.backgroundColor = '#d9d9d9'
                child.style.color = '#fff'
            }
        })
    }

    function saveRating() {
        //send new post request to server

        axios.post(`http://localhost:4000/api/set_rating/`, {
            u_id: userID,
            j_id: judgeID,
            rating: newRating
        }).then((res) => {
            closeModal();
        }).catch((err) => console.log(err));
    }

    // need to add logic for currently selected color, before changes have even been made

    return (
        <div>
            <button
                class="editRatingButton"
                onClick={openModal}>
                    Edit 
            </button>

            {isEditing && (
                <div>
                    <div class="overlay"> </div>
                    <div class="editRatingModal">
                        <h3> Edit Judge Rating </h3>
                        <div class="ratingButtons">
                            <button id="unselectOption" onClick={clickRating}> - </button>
                            <button id="optionOne" onClick={clickRating}> 1 </button>
                            <button id="optionTwo" onClick={clickRating}> 2 </button>
                            <button id="optionThree" onClick={clickRating}> 3 </button>
                            <button id="optionFour" onClick={clickRating}> 4 </button>
                            <button id="optionFive" onClick={clickRating}> 5 </button>
                            <button id="optionStrike" onClick={clickRating}> S </button>
                        </div>
                        <div style={
                            {width: "100%", display: "flex", justifyContent: "center"}}>
                            <button class="pillButton" onClick={saveRating} to ="/judges"> Save </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default EditRating;