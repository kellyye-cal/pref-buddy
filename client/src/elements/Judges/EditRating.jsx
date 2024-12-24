import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../../context/AuthProvider';
import axios from 'axios'
import '../../App.css';

const styles = {
    unselected: {
        backgroundColor: "#d9d9d9"
    },
    noRating: {
        backgroundColor: "#6a6a6a"
    },
    one: {
        backgroundColor: "#148943"
    },
    two: {
        backgroundColor: "#9DE06E",
        color: '#333'
    },
    three: {
        backgroundColor: "#FFD900",
        color: '#333'
    },
    four: {
        backgroundColor: "#F3A72D",
        color: '#333'
    },
    five: {
        backgroundColor: "#FF7D38",
        color: '#333'
    },
    strike: {
        backgroundColor: "#FF2A2A"
    }
}


function EditRating({userID, judgeID, currRating, updateFunc}) {    
    const [isEditing, setIsEditing] = useState(false);
    const [rating, setRating] = useState(currRating)
    const {auth, setAuth} = useContext(AuthContext);

    const openModal = () => setIsEditing(true);
    const closeModal = () => setIsEditing(false);

    function clickRating(event) {
        const newRatingID = event.target.id;

        switch (newRatingID) {
            case 'unselectOption':
                event.target.style.backgroundColor = styles.noRating.backgroundColor;
                setRating(0)
                break;
            case 'optionOne':
                event.target.style.backgroundColor = styles.one.backgroundColor;
                setRating(1)
                break;
            case 'optionTwo':
                event.target.style.backgroundColor = styles.two.backgroundColor;
                event.target.style.color = styles.two.color;
                setRating(2)
                break;
            case 'optionThree':
                event.target.style.backgroundColor = styles.three.backgroundColor;
                event.target.style.color = styles.three.color;
                setRating(3)
                break;
            case 'optionFour':
                event.target.style.backgroundColor = styles.four.backgroundColor;
                event.target.style.color = styles.four.color;
                setRating(4)
                break;
            case 'optionFive':
                event.target.style.backgroundColor = styles.five.backgroundColor;
                event.target.style.color = styles.five.color;
                setRating(5)
                break;
            case 'optionStrike':
                event.target.style.backgroundColor = styles.strike.backgroundColor;
                setRating(6)
                break;
            default:
                break;
        }

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
        axios.post('http://localhost:4000/api/set_rating/', {
            u_id: userID,
            j_id: judgeID,
            rating: rating
        }, {headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
        }}).then(() => {
            updateFunc(judgeID, rating);
            closeModal();
        }).catch((err) => {
            console.error("Error saving rating", err)
        })
    }

    const getButtonStyle = (buttonValue, activeValue) => {
        if (buttonValue !=activeValue) {
            return styles.unselected;
        }

        switch (buttonValue) {
            case 1:
                return styles.one;
            case 2:
                return styles.two;
            case 3:
                return styles.three;
            case 4:
                return styles.four;
            case 5:
                return styles.five;
            case 6:
                return styles.strike;
            default:
                return styles.noRating;
        }
    }

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
                            <button id="unselectOption" onClick={clickRating} style={getButtonStyle(0, currRating)}> - </button>
                            <button id="optionOne" onClick={clickRating} style={getButtonStyle(1, currRating)}> 1 </button>
                            <button id="optionTwo" onClick={clickRating} style={getButtonStyle(2, currRating)}> 2 </button>
                            <button id="optionThree" onClick={clickRating} style={getButtonStyle(3, currRating)}> 3 </button>
                            <button id="optionFour" onClick={clickRating} style={getButtonStyle(4, currRating)}> 4 </button>
                            <button id="optionFive" onClick={clickRating} style={getButtonStyle(5, currRating)}> 5 </button>
                            <button id="optionStrike" onClick={clickRating} style={getButtonStyle(6, currRating)}> S </button>
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