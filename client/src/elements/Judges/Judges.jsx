import React, { useEffect, useState, useContext} from 'react';
import axios from '../../api/axios';
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
        axios.get(`/api/judges/all-judges`, 
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
        axios.post(`/api/judges/set_rating`, {
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

        axios.get(`/api/judges/all-judges`,
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
        // If a is less than b, the result is negative, and a is placed before b.
        // If a is greater than b, the result is positive, and a is placed after b.
        // If a and b are equal, the result is zero, and their order remains unchanged.
        // 1 2 3 4 5 6 0

        if (b.rating === a.rating) {
            return (a.name).localeCompare(b.name)
        }

        if (a.rating === 0 || !a.rating) {
            return 1;
        } else if (b.rating === 0 || !b.rating) {
            return -1;
        }
        return a.rating - b.rating
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