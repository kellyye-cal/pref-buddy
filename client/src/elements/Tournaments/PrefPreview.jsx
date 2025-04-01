import React, {useState, useEffect} from "react";
import Rating from "../Judges/Rating";

const styles = {
    "Point Fairy": {
        backgroundColor: "#32B165",
        color: "#FFFFFF"
    },
    "Average Speaks": {
        backgroundColor: "#FFD900"
    },
    "Low Speaks": {
        backgroundColor: "#FF7D38",
        color: "#FFFFFF"
    },
    "Judges a Lot": {
        backgroundColor: "#32B165",
        color: "#FFF"
    }
}

function PrefPreview({judgeData, updateFunc, onSelect, isSelected, commStats}) {
    const [pointDisplay, setPointDisplay] = useState([])
    const [judgeFreq, setJudgeFreq] = useState(false);

    useEffect(() => {
        if (commStats.avg - commStats.sd < judgeData.speaks.avg && judgeData.speaks.avg < commStats.avg + commStats.sd) {
            setPointDisplay("Average Speaks")
        } else if (judgeData.speaks.avg >= commStats.avg + commStats.sd) {
            setPointDisplay("Point Fairy")
        } else if (judgeData.speaks.avg <= commStats.avg - commStats.sd) {
            setPointDisplay("Low Speaks")
        }

        if (judgeData.numRounds > 24) {
            setJudgeFreq(true)
        }
    }, [judgeData, commStats])

    
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
                                <div className="badges mini">
                                    {judgeData.speaks.avg ?
                                        <div style={styles[pointDisplay]}> <b> {judgeData.speaks.avg} </b> Average </div>
                                    : <></>}

                                    {judgeFreq ?
                                        <div style={styles["Judges a Lot"]}> Judges a Lot </div>
                                    : <></>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default PrefPreview;