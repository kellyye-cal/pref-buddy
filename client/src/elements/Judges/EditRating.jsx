import React, { useState, useContext } from 'react';
import AuthContext from '../../context/AuthProvider';
import axios from '../../api/axios';
import '../../App.css';
import FloatingModal from '../FloatingModal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

const styles = {
    unselected: {
        backgroundColor: "#d9d9d9"
    },
    0: {
        backgroundColor: "#6a6a6a"
    },
    1: {
        backgroundColor: "#148943"
    },
    2: {
        backgroundColor: "#9DE06E",
        color: '#333'
    },
    3: {
        backgroundColor: "#FFD900",
        color: '#333'
    },
    4: {
        backgroundColor: "#F3A72D",
        color: '#333'
    },
    5: {
        backgroundColor: "#FF7D38",
        color: '#333'
    },
    6: {
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
            case 'option0':
                setRating(0)
                break;
            case 'option1':
                setRating(1)
                break;
            case 'option2':
                setRating(2)
                break;
            case 'option3':
                setRating(3)
                break;
            case 'option4':
                setRating(4)
                break;
            case 'option5':
                setRating(5)
                break;
            case 'option6':
                setRating(6)
                break;
            default:
                break;
        }

        const allButtons = Array.from(document.querySelector('.ratingButtons').children)
        
        allButtons.forEach(child => {
            if (child.id !== newRatingID) {
                child.style.backgroundColor = '#d9d9d9'
                child.style.color = '#fff'
            }
        })

    }

    function saveRating() {
        //send new post request to server
        axios.post('/api/judges/set_rating', {
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

    return (
        <div>
            <button
                className="editRatingButton"
                onClick={openModal}>
                    Edit 
            </button>

            <FloatingModal isOpen={isEditing} closeFunc={closeModal}>
                <div className="h-between">
                    <h3 style={{margin: 0}}> Edit Judge Rating </h3>
                    <button onClick={closeModal}>
                        <FontAwesomeIcon icon={faTimes} size="sm"/>
                    </button>
                </div>

                <div className="ratingButtons">
                    {[0, 1, 2, 3, 4, 5, 6].map((val) => (
                        <button
                            key={val}
                            id={`option${val}`}
                            onClick={clickRating}
                            style={val === rating ? styles[val] : styles.unselected}
                        >
                            {val === 0 ? '-' : val === 6 ? "S" : val}
                        </button>
                    ))}
                </div>

                <div style={
                            {width: "100%", display: "flex", justifyContent: "center"}}>
                            <button className="pillButton" onClick={saveRating} to ="/judges"> Save </button>
                        </div>

            </FloatingModal>

            {/* {isEditing && (
                <div>
                    <div className="overlay"> </div>
                    <div className="editRatingModal">
                        <h3> Edit Judge Rating </h3>
                        <div className="ratingButtons">
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
                            <button className="pillButton" onClick={saveRating} to ="/judges"> Save </button>
                        </div>
                    </div>
                </div>
            )} */}

        </div>
    )
}

export default EditRating;