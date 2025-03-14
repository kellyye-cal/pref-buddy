import React, {useContext, useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCheck, faSpinner} from '@fortawesome/free-solid-svg-icons'


import AuthContext from '../../context/AuthProvider';
import NavBar from '../NavBar';
import PrefPreview from './PrefPreview';
import Search from '../Search'
import SidePanel from '../SidePanel';
import ExportCSV from './ExportCSV';
import Sort from '../Sort';
import JudgeFilters from '../Judges/JudgeFilters';
import RoundHistory from '../Judges/RoundHistory';
import RoundDisplay from './RoundDisplay';

function TournPage() {
    const {auth, setAuth} = useContext(AuthContext);
    const { tournId } = useParams();

    const [tournData, setTournData] = useState([])
    const [judgingData, setJudgingData] = useState([])
    const [judgeData, setJudgeData] = useState([])
    const [filteredJudges, setFilteredJudges] = useState([])

    const [numRated, setNumRated] = useState(0)
    const [totalJudges, setTotalJudges] = useState(0)
    const [status, setStatus] = useState(["pending"])

    const [category, setCategory] = useState("Rating")
    const [asc, setAsc] = useState(true)

    const [filters, setFilters] = useState([])

    useEffect(()=>{
        // Get the tournament information
        axios.get(`/api/tournaments/${tournId}`, {headers: {
            Authorization: `Bearer ${auth?.accessToken}`}}
        ).then((res) => {
            setTournData(res.data.attending)
            setJudgingData(res.data.judging)
            setNumRated(res.data.attending.prefData.numRated)
            setTotalJudges(res.data.attending.prefData.numTotal)
        })
        .catch((err)=>console.log(err))

        // Get a list of judges and their ratings by this user at this tournament
        axios.get(`/api/tournaments/${tournId}/judges`, {params: {u_id: auth.userId}, headers: {
            Authorization: `Bearer ${auth?.accessToken}`}}
        ).then((res) => {
            setJudgeData(res.data)
            setFilteredJudges(res.data)
        }).catch((err) => console.log(err))
    }, []);

    useEffect(() => {
        if (numRated === totalJudges) {
            setStatus("complete")
        } else {
            setStatus("pending")
        }
    }, [numRated])

    const updateRating = (judgeID, newRating) => {
        axios.post(`/api/judges/set_rating/`, {
            u_id: auth.userId,
            j_id: judgeID,
            rating: newRating
        }, {headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
        }}).then(() => {
            setJudgeData(prevJudges => prevJudges.map(judge => 
                judge.id === judgeID ? {...judge, rating: newRating} : judge
            ));

            if (selectedJudge && selectedJudge.j_id === judgeID) {
                setSelectedJudge(prev => ({ ...prev, rating: newRating }));
            }
        }).catch((err) => console.error("Error saving rating:", err));
    
        axios.get(`/api/tournaments/${tournId}/judges`,
            {params:{
                u_id: auth.userId
            }, headers: {
                Authorization: `Bearer ${auth?.accessToken}`,
            }}
            ).then((res) => {
                setJudgeData(res.data);
                setFilteredJudges(res.data)
            })
            .catch((err)=>console.log("Error getting all judges: ", err))

        if (newRating > 0) {
            setNumRated(numRated + 1)
        }
    }

    function sortJudges(a, b) {
        let sort = 0;

        if (category === "Rating") {
            if (b.rating === a.rating) {
                sort = (a.name).localeCompare(b.name)
            }

            sort = a.rating - b.rating;
        }

        if (category === "Name") {
            sort = (a.name).localeCompare(b.name)
        }

        if (asc) {
            return sort;
        } else {
            return sort * -1;
        }
    }

    const sortedJudges = [...filteredJudges].sort((a, b) => {
       return sortJudges(a, b)
    })

    const [selectedJudge, setSelectedJudge] = useState(null)

    const handleSelectJudge = (judge) => {
        setSelectedJudge(judge)
    }

    const closeSidePanel = () => {
        setSelectedJudge(null)
    }

    var defaultFileName = (tournData.name || "").toLowerCase().replace(/ /g, "_");
    
    return (
        <div className="page">
            <NavBar />
            <div className="main" style={{display: "flex", flexDirection: "column", overflow: ""}}>
                <h1> {tournData.name} </h1>

                {judgingData.judging && judgingData.roundHistory.length > 0 ?
                    <div style={{marginBottom: 40}}>
                        <h2> Rounds </h2>
                        <RoundDisplay rounds={judgingData.roundHistory} displayTournament={false}/>
                    </div>
                    
                    :

                    <> </>
                }

                <div className="h-between" style={{alignItems: "center"}}>
                    <h2 style={{marginBottom: 0}}> Prefs </h2>

                    <div style={{display: "flex", alignItems: "center"}}>
                        <div style={{marginRight: 12}}>
                            <span style={{marginRight: 4, fontWeight: 500}}> {numRated} / {totalJudges} </span>
                            {status === "pending" ? 
                            <FontAwesomeIcon icon={faSpinner} size="lg" style={{color: "#f3a72d"}}/>
                            : 
                            <FontAwesomeIcon icon={faCheck} size="lg" style={{color: "#148943"}}/>}
                        </div>

                        <ExportCSV tournId={tournId} defaultFileName={defaultFileName}/>
                    </div>
                </div>

                <div>
                    <Search data={judgeData} keys={["name"]} onFilteredRecordChange={setFilteredJudges}/>

                    <div style={{display: "flex", alignItems: "center", gap: 4}}>
                        <Sort category={category} setCategory={setCategory} asc={asc} setAsc={setAsc} />
                        <div className="sort-filter-option"> | </div>
                        <JudgeFilters filteredJudges={filteredJudges} setFilteredJudges={setFilteredJudges} allJudges={judgeData}/>
                    </div>    
                    <div className="v-scroll" style={{height: 460}}>
                        {sortedJudges.map((judge, index) => (
                            <PrefPreview key={index} judgeData={judge} updateFunc={updateRating} onSelect={handleSelectJudge}
                            isSelected={selectedJudge?.j_id === judge.j_id}/>
                        ))}
                    </div>

                    {selectedJudge && (
                        <SidePanel judgeData={selectedJudge} updateFunc={updateRating} closeFunc={closeSidePanel} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default TournPage