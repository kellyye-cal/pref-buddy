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
        axios.get(`http://localhost:4000/api/judges/all-judges`, 
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
        axios.post(`http://localhost:4000/api/judges/set_rating`, {
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

        axios.get(`http://localhost:4000/api/judges/all-judges`,
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

    const sortedJudges = [...filteredRecords].sort((a, b) => {
        if (b.rating === a.rating) {
            return (a.name).localeCompare(b.name)
        }
        return b.rating - a.rating
    })

    return (
            <div className="page">
                <NavBar />
                <div className="main" style={{display: "flex", flexDirection: "column", overflow: "hidden"}}>
                    <h1> Judges </h1>
                    <Search data={allJudges} keys={['name', 'affiliation']} onFilteredRecordChange={setFilteredRecords}> </Search>
                    <div className="v-scroll">
                        {Array.isArray(sortedJudges) && sortedJudges.length > 0 ? (
                                sortedJudges.map((judge, index) => (
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