import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios'


import AuthContext from '../../context/AuthProvider';
import NavBar from '../NavBar';

import TournList from './TournList';
import Search from '../Search';


function Tournaments() {
    const {auth, setAuth} = useContext(AuthContext);
    const [tournaments, setTournaments] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:4000/api/tournaments/all`, {headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
        }}
    ).then((res) => {
        setTournaments(res.data)
        setFilteredRecords(res.data)
    }).catch((err)=>console.log("Error getting all tournaments: ", err))
    }, [auth.userId]);


    return (
        <div className="page">
            <NavBar />
            <div className="main">
                <h1> Tournaments </h1>
                
                <Search data={tournaments} keys={["name"]} onFilteredRecordChange={setFilteredRecords} />
                <TournList data={filteredRecords}/>
            </div>
        </div>
    )
}

export default Tournaments;