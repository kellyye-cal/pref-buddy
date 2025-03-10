import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/AuthProvider';
import {Link, useParams} from "react-router-dom";
import axios from '../api/axios';
import '../App.css';

import TournamentCard from './TournamentCard';



function TournCardContainer({userID}) {
    // GET A LIST OF TOURNAMENTS ATTENDED BY THE USER, THEN MAP IT TO A TOURNAMENT CARD INSTANCE
    const {auth} = useContext(AuthContext);
    const [allTournaments, setData] = useState([]); //to store fetched data
    var upcoming;

    useEffect(()=>{
        if (!auth?.accessToken) return;
        
        axios.get(`/api/tournaments/mytournaments`, {
            headers: {
                Authorization: `Bearer ${auth?.accessToken}`,
            },
            withCredentials: true,
        }).then((res) => {
            setData(res.data);
        }).catch((err)=>console.log("Error getting all tournaments: ", err))

    }, []);

    upcoming = allTournaments.filter((tourn) => {
        const now = new Date();
        const end = new Date(tourn.end_date)
        
        return(now < end)
     })


    return (
        <div className="tourn-grid">
            {upcoming && upcoming.length > 0 ? (
                upcoming.map((tourn, index) => (
                    <TournamentCard key={index} userID={userID} tourn={tourn}/>
                ))

            ) : (
                <div> No upcoming tournaments. </div>
            )}
        </div>
    )
}
export default TournCardContainer;