import React, { useEffect, useContext, useState } from 'react';
import axios from '../../api/axios';


import AuthContext from '../../context/AuthProvider';
import NavBar from '../NavBar';

import TournList from './TournList';
import Search from '../Search';
import AddTournament from './AddTournament';


function Tournaments() {
    const {auth} = useContext(AuthContext);
    const [tournaments, setTournaments] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);

    var filteredPast;
    var filteredUpcoming;
    const now = new Date();

    const fetchTournaments = async () => {
        axios.get(`/api/tournaments/mytournaments`, {headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
        }}
        ).then((res) => {
            setTournaments(res.data)
            setFilteredRecords(res.data)
        }).catch((err)=>console.log("Error getting all tournaments: ", err))
    }

    useEffect(() => {
        fetchTournaments();
    });

    filteredPast = filteredRecords.filter((tourn) => {
        const end = new Date(tourn.end_date)

        return (now > end)
    })

    filteredUpcoming = filteredRecords.filter((tourn) => {
        const end = new Date(tourn.end_date)

        return (now < end)
    })


    return (
        <div className="page">
            <NavBar />
            <div className="main v-scroll">
                <div className="h-between" style={{alignItems: "center"}}>
                    <h1> My Tournaments </h1>
                    <AddTournament onAdd={fetchTournaments}/>
                </div>

                
                <Search data={tournaments} keys={["name"]} onFilteredRecordChange={setFilteredRecords} />



                <h2 style={{marginTop: 12}}> Upcoming </h2>
                <TournList data={filteredUpcoming} sortOrder={"asc"}/>

                <h2 style={{marginTop: 20}}> Past </h2> 
                <TournList data={filteredPast} sortOrder={"dsc"}/>
            </div>
        </div>
    )
}

export default Tournaments;