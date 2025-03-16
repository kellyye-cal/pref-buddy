import React, {useState, useRef, useEffect, useContext} from "react";
import AuthContext from "../../context/AuthProvider";
import Dropdown from '../Dropdown';
import axios from '../../api/axios';

function RoundType({t_id, round, j_id, type}) {
    const {auth} = useContext(AuthContext);
    const [roundType, setRoundType] = useState(type);
    const [isOpen, setOpen] = useState(false);
    const buttonRef = useRef(null)


    const saveRoundType = (type) => {
        console.log(t_id, round, j_id, type)
        axios.post(`/api/tournaments/saveRoundType`, {t_id, round, j_id, type}, {
            headers: {Authorization: `Bearer ${auth?.accessToken}`},
            withCredentials: true}
        ).then((res) => {
            setRoundType(res.data.type)
        }).catch((err)=>console.log("Error getting round: ", err))
    }


    const closeDropdown = () => {setOpen(false)}
    const reverseOpen = () => {setOpen(!isOpen)}

    const setUnselected = () => {
        setRoundType("");
        setOpen(false);
        saveRoundType("");
    }

    const setPvP = () => {
        setRoundType("Policy v. Policy");
        setOpen(false);
        saveRoundType("Policy v. Policy");
    }

    const setPvK = () => {
        setRoundType("Policy v. K");
        setOpen(false);
        saveRoundType("Policy v. K");
    }

    const setKvP = () => {
        setRoundType("K v. Policy");
        setOpen(false);
        saveRoundType("K v. Policy");
    }

    const setKvK = () => {
        setRoundType("K v. K");
        setOpen(false);
        saveRoundType("K v. K");
    }

    const setT = () => {
        setRoundType("T/Theory");
        setOpen(false);
        saveRoundType("T/Theory");
    }

    return (
        <div>
            <div>
                <button ref={buttonRef} onClick={reverseOpen}
                    className={`pill ${roundType === "Policy v. Policy" ? "pvp" 
                    : roundType === "Policy v. K" ? "pvk"
                    : roundType === "K v. Policy" ? "kvp"
                    : roundType === "K v. K" ? "kvk"
                    : roundType === "T/Theory" ? "theory"
                    : "unselected"}`}
                    style={{maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
                        {roundType ? roundType : "Select round type..."} 
                </button>
                <Dropdown isOpen={isOpen} closeFunc={closeDropdown} buttonRef={buttonRef}> 
                    <button className="round-type" onClick={setUnselected}> 
                        <div className="unselected">
                            Unspecified
                        </div>
                    </button>

                    <button className="round-type" onClick={setPvP}> 
                        <div className="pvp">
                            Policy v. Policy
                        </div>
                    </button>

                    <button className="round-type" onClick={setPvK}> 
                        <div className="pvk">
                            Policy v. K
                        </div>
                    </button>

                    <button className="round-type" onClick={setKvP}> 
                        <div className="kvp">
                            K v. Policy
                        </div>
                    </button>

                    <button className="round-type" onClick={setKvK}> 
                        <div className="kvk">
                            K v. K
                        </div>
                    </button>

                    <button className="round-type"onClick={setT}> 
                        <div className="theory">
                            Theory
                        </div>
                    </button>
                </Dropdown>
            </div>
        </div>
    )
};

export default RoundType;