import React, {useContext, useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/axios';

import AuthContext from '../../context/AuthProvider';
import NavBar from '../NavBar';
import Back from '../Back';
import PrefPreview from './PrefPreview';
import Search from '../Search'

function TournPage() {
    const {auth, setAuth} = useContext(AuthContext);
    const { tournId } = useParams();

    const [tournData, setTournData] = useState([])
    const [judgeData, setJudgeData] = useState([])
    const [filteredJudges, setFilteredJudges] = useState([])

    useEffect(()=>{
        // Get the tournament information
        axios.get(`http://localhost:4000/api/alltournaments`, {headers: {
            Authorization: `Bearer ${auth?.accessToken}`}}
        ).then((res) => {
            setTournData(res.data.find((t) => String(t.t_id) === tournId));
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

    const updateRating = (judgeID, newRating) => {
        axios.post(`http://localhost:4000/api/set_rating/`, {
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
    }

    


    return (
        <div class="page">
            <NavBar />
            <div class="main">
                <Back link={"/tournaments"}> </Back>
                <h1> {tournData.name} </h1>
                <h2> Prefs </h2>
                <Search data={judgeData} keys={["name"]} onFilteredRecordChange={setFilteredJudges}/>
                {filteredJudges.map((judge, index) => (
                    <PrefPreview key={judge.id} judgeData={judge} updateFunc={updateRating}/>
                ))}
            </div>
        </div>
    )
}

export default TournPage