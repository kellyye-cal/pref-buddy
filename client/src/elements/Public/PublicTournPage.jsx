import React, {useEffect, useState, useRef} from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";
import RoundDisplay from "../Tournaments/RoundDisplay";
import TopNav from "./TopNav"
import Dropdown from "../Dropdown";


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faChevronDown} from '@fortawesome/free-solid-svg-icons'

function PublicTournPage() {
    const { id } = useParams();
    const [tournament, setTournament] = useState([]);
    const [rounds, setRounds] = useState([]);
    const [filteredRounds, setFilteredRounds] = useState([])
    const [selectedRound, setSelectedRound] = useState("r1");
    const roundSelectorRef = useRef(null)

    const [roundSelectorOpen, setRoundSelectorOpen] = useState(false);

    const closeRoundSelector = () => {setRoundSelectorOpen(false)};
    const reverseRoundSelector = () => {setRoundSelectorOpen(!roundSelectorOpen)}

    useEffect(() => {
        axios.get(`/api/public/tournaments/${id}`,
            {headers: {'Content-Type': 'application/json'}, withCredentials: true}
        ).then((res) => {
            setTournament(res.data.info);
            setRounds(res.data.rounds)
            setFilteredRounds(res.data.rounds.filter((r) => {return (r.number === "1")}))
            console.log(res.data.rounds)
        }).catch((error) => {
            console.error(`Error getting data for tournament ${id}: `, error)
        })
    }, [id]);

    const handleSelectRound = (e) => {
        const selected = e.target.id;

        setSelectedRound(selected);
        const selectedRounds = rounds.filter((round) => {
            return (round.number === selected.substring(1))
        })
        setFilteredRounds(selectedRounds);
        
    }

    const roundOrder = ["1", "2", "3", "4", "5", "6", "Doubles", "Octas", "Quarters", "Semis", "Finals"];
    const uniqueRounds = [...new Set(rounds.map(round => round.number))];
    const sortedRounds = roundOrder.filter(round => uniqueRounds.includes(round));


    return (
        <div>
            <TopNav />
            <div className="public-main">
            <h3> {tournament.name} </h3>
                <div style={{marginBottom: 12}}>
                    <button className="pill sort" ref={roundSelectorRef} onClick={reverseRoundSelector}>
                        {parseInt(selectedRound.substring(1)) ? "Round" : ""} {selectedRound.substring(1)}
                        <FontAwesomeIcon icon={faChevronDown} size="xs" style={{marginLeft: 6}}/>
                        
                        <Dropdown isOpen={roundSelectorOpen} closeFunc={closeRoundSelector} buttonRef={roundSelectorRef}>
                            <div className="round-selectors">
                                {sortedRounds.map((roundNumber, index) => (
                                    <button 
                                        key={index} 
                                        id={`r${roundNumber}`} 
                                        onClick={handleSelectRound}
                                    >
                                        {parseInt(roundNumber) ? "Round" : ""} {roundNumber}
                                    </button>
                                ))}
                            </div>
                        </Dropdown>
                    </button>

                </div>
                <RoundDisplay rounds={filteredRounds} displayTournament={false} displayJudge={true} publicView={true} judgeLink="/public/judges" groupElims={true}/>
            </div>
        </div>
    )
}

export default PublicTournPage;