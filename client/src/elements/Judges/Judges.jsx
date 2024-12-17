import React, { useEffect, useState, useContext} from 'react';
import axios from 'axios'
import '../../App.css';

import AuthContext from '../../context/AuthProvider';
import NavBar from '../NavBar'
import JudgePreview from './JudgePreview'
import Search from '../Search'

function Judges() {
    const {auth, setAuth} = useContext(AuthContext);

    const [allJudges, setData] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);

    useEffect(()=>{
        axios.get(`http://localhost:4000/api/alljudges`, 
        {params:{
            u_id: auth.userId
        }, headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
        }}
        ).then((res) => {
            setData(res.data);
            setFilteredRecords(res.data)
        })
        .catch((err)=>console.log("Error getting all judges: ", err))
    }, [auth.userId]);

    const updateRating = (judgeID, newRating) => {
        axios.post(`http://localhost:4000/api/set_rating/`, {
            u_id: auth.userId,
            j_id: judgeID,
            rating: newRating
        }, {headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
        }}).then(() => {
            setData(prevJudges => prevJudges.map(judge => 
                judge.id === judgeID ? {...judge, rating: newRating} : judge
            ));
        }).catch((err) => console.error("Error saving rating:", err));

        axios.get(`http://localhost:4000/api/alljudges`,
            {params:{
                u_id: auth.userId
            }, headers: {
                Authorization: `Bearer ${auth?.accessToken}`,
            }}
            ).then((res) => {
                setData(res.data);
                setFilteredRecords(res.data)
            })
            .catch((err)=>console.log("Error getting all judges: ", err))
    }

    return (
            <div class="page">
                <NavBar />
                <div class="main">
                    <h1> Judges </h1>
                    <Search data={allJudges} keys={['name', 'affiliation']} onFilteredRecordChange={setFilteredRecords}> </Search>
                    <div>
                        {Array.isArray(filteredRecords) && filteredRecords.length > 0 ? (
                                filteredRecords.map((judge, index) => (
                                    <div key={index}><JudgePreview judge={judge} userID={auth.userId} updateFunc={updateRating}/> </div>
                                ))
                            ) : (
                                <div></div>
                            )}
                    </div>
                </div>
            </div>
    )
}

export default Judges;