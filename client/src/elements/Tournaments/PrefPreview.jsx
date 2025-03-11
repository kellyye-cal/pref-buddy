import React from "react";
import Rating from "../Judges/Rating";



function PrefPreview({judgeData, updateFunc, onSelect, isSelected}) {

 return (
    <div>
        <div className="overlay-container">
            <div className="pref-overlay"> </div>

            <div className={`judgePreview ${isSelected ? "selected" : ""}`} onClick={() => onSelect(judgeData)}>
                <div className="h-between" style={{alignItems: "center"}}>
                    <div style={{display:'flex', alignItems:"center"}}>
                        <div className="ratingContainer">
                            <Rating rating={judgeData.rating}/>

                        </div>
                        <div style={{marginLeft: 20}}>
                            <div className="judgePrevName"> {judgeData.name} </div>
                            <p className="judgePrevAffiliation"> {judgeData.affiliation}</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
 )
}

export default PrefPreview;