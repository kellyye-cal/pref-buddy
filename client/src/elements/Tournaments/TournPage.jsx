import React, {useContext, useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCheck, faSpinner} from '@fortawesome/free-solid-svg-icons'


import AuthContext from '../../context/AuthProvider';
import NavBar from '../NavBar';
import Back from '../Back';
import PrefPreview from './PrefPreview';
import Search from '../Search'
import SidePanel from '../SidePanel';

function TournPage() {
    const {auth, setAuth} = useContext(AuthContext);
    const { tournId } = useParams();

    const [tournData, setTournData] = useState([])
    const [judgeData, setJudgeData] = useState([])
    const [filteredJudges, setFilteredJudges] = useState([])

    const [numRated, setNumRated] = useState(0)
    const [totalJudges, setTotalJudges] = useState(0)
    const [status, setStatus] = useState(["pending"])

    useEffect(()=>{
        // Get the tournament information
        axios.get(`http://localhost:4000/api/tournaments/${tournId}`, {headers: {
            Authorization: `Bearer ${auth?.accessToken}`}}
        ).then((res) => {
            setTournData(res.data.tournament)
            setNumRated(res.data.numRated)
            setTotalJudges(res.data.numTotal)
            // setTournData(res.data.find((t) => String(t.t_id) === tournId));
        })
        .catch((err)=>console.log(err))

        // Get a list of judges and their ratings by this user at this tournament
        axios.get(`http://localhost:4000/api/tournaments/${tournId}/judges`, {params: {u_id: auth.userId}, headers: {
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
        axios.post(`http://localhost:4000/api/judges/set_rating/`, {
            u_id: auth.userId,
            j_id: judgeID,
            rating: newRating
        }, {headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
        }}).then(() => {
            setJudgeData(prevJudges => prevJudges.map(judge => 
                judge.id === judgeID ? {...judge, rating: newRating} : judge
            ));
        }).catch((err) => console.error("Error saving rating:", err));
    
        axios.get(`http://localhost:4000/api/tournaments/${tournId}/judges`,
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

    const sortedJudges = [...filteredJudges].sort((a, b) => {
        if (b.rating === a.rating) {
            return (a.name).localeCompare(b.name)
        }
        return a.rating - b.rating
    })

    const [selectedJudge, setSelectedJudge] = useState(null)

    const handleSelectJudge = (judge) => {
        setSelectedJudge(judge)
    }

    const closeSidePanel = () => {
        setSelectedJudge(null)

    }

    
    return (
        <div className="page">
            <NavBar />
            <div className="main" style={{display: "flex", flexDirection: "column", overflow: "hidden"}}>
                <Back link={"/tournaments"}> </Back>
                <h1> {tournData.name} </h1>

                <div className="h-between" style={{alignItems: "center"}}>
                    <h2> Prefs </h2>
                    <div style={{marginBottom: 8}}>
                        <span style={{marginRight: 4, fontWeight: 500}}> {numRated} / {totalJudges} </span>
                        {status === "pending" ? 
                        <FontAwesomeIcon icon={faSpinner} size="lg" style={{color: "#f3a72d"}}/>
                        : 
                        <FontAwesomeIcon icon={faCheck} size="lg" style={{color: "#148943"}}/>}
                    </div>
                </div>

                <Search data={judgeData} keys={["name"]} onFilteredRecordChange={setFilteredJudges}/>
                <div className="v-scroll">
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
    )
}

export default TournPage