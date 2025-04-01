import React, {useState, useEffect} from "react";
import axios from '../../api/axios'

import { FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faQuestionCircle} from '@fortawesome/free-regular-svg-icons'

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
    "Mostly Judges Policy": {
        backgroundColor: "#ADCFFF"
    },
    "Mostly Judges Ks": {
        backgroundColor: "#FFA1F2"
    },
    "Flex": {
        backgroundColor: "#32B165",
        color: "#FFF"
    },
    "Judges a Lot": {
        backgroundColor: "#32B165",
        color: "#FFF"
    }
}

function Badges({j_id, rounds}) {
    const [pointDisplay, setPointDisplay] = useState("");
    const [mostlyJudges, setMostlyJudges] = useState("");
    const [flex, setFlex] = useState("")
    const [judgesALot, setJudgesALot] = useState("")

    const handleRoundTypes = () => {
        var policyCount = 0;
        var kCount = 0;

        
        for (let i = 0; i < rounds.length; i++) {
            const round = rounds[i];
            if (round.round_type === "Policy v. Policy") {
                policyCount += 1;
            } else if (round.round_type === "Policy v. K") {
                kCount += 1;
            } else if (round.round_type === "K v. Policy") {
                kCount += 1;
            } else if (round.round_type === "T/Theory") {
                policyCount += 1;
            } else if (round.round_type === "K v. K") {
                kCount += 1;
            }
        }


        if (policyCount > kCount) {
            setMostlyJudges("Mostly Judges Policy")
        } else if (policyCount < kCount) {
            setMostlyJudges("Mostly Judges Ks")
        }

        const percentPolicy = policyCount / rounds.length;
        const percentK = kCount / rounds.length;

        if (Math.abs(percentPolicy - percentK) <= 0.3 && (percentPolicy > 0 || percentK > 0)) {
            setFlex("Flex")
        }

        if (rounds.length > 24) {
            setJudgesALot("Judges a Lot")
        }
    }


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [judgeSpeaksRes, communitySpeaksRes] = await Promise.all([
                    axios.get(`/api/public/judges/speaks/${j_id}`),
                    axios.get("/api/public/community_stats")
                ]);

                const judgeSpeaks = judgeSpeaksRes.data;
                const communitySpeaks = communitySpeaksRes.data

                handlePointDisplay({judgeSpeaks, communitySpeaks})
                handleRoundTypes();
            } catch (err) {
                console.error(err)
            }
        }

        fetchData();

    })

    const handlePointDisplay = ({judgeSpeaks, communitySpeaks}) => {
        if (communitySpeaks.avg - communitySpeaks.sd < judgeSpeaks.avg && judgeSpeaks.avg < communitySpeaks.avg + communitySpeaks.sd) {
            setPointDisplay("Average Speaks")
        } else if (judgeSpeaks.avg >= communitySpeaks.avg + communitySpeaks.sd) {
            setPointDisplay("Point Fairy")
        } else if (judgeSpeaks.avg <= communitySpeaks.avg - communitySpeaks.sd) {
            setPointDisplay("Low Speaks")
        }
    }

    return (
        <div className="container container-spacing" style={{marginBottom: 0}}>
            <div className="h-between align-center">
                <h3 style={{margin: 0}}> At a Glance </h3>
                <div className="tooltip-container">
                    <span className="tooltip-text">
                        See the home page to learn how badges are assigned to judges.
                    </span>
                    <FontAwesomeIcon icon={faQuestionCircle}/>
                </div>
            </div>
            <div className="badges">
                <div style={styles[pointDisplay]}> {pointDisplay} </div>
                {flex ? <div style={styles[flex]}> {flex} </div> : <></>}
                {judgesALot ? <div style={styles[judgesALot]}> {judgesALot} </div> : <></>}
                <div style={styles[mostlyJudges]}> {mostlyJudges} </div>
            </div>
        </div>
    )
}

export default Badges