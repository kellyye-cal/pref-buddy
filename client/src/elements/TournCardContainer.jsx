import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/AuthProvider';
import {Link, useParams} from "react-router-dom";
import axios from 'axios'
import '../App.css';

import TournamentCard from './TournamentCard';



function TournCardContainer({userID}) {
    // GET A LIST OF TOURNAMENTS ATTENDED BY THE USER, THEN MAP IT TO A TOURNAMENT CARD INSTANCE
    const {auth} = useContext(AuthContext);
    const [allTournaments, setData] = useState([]); //to store fetched data

    useEffect(()=>{
        if (!auth?.accessToken) return;
        
        axios.get(`http://localhost:4000/api/tournaments`, {
            headers: {
                Authorization: `Bearer ${auth?.accessToken}`,
            },
            withCredentials: true,
        }).then((res) => {
            setData(res.data);
        })
        .catch((err)=>console.log("Error getting all judges: ", err))
    }, []);


    return (
        <div class="h-between">
            {allTournaments && allTournaments.length > 0 ? (
                allTournaments.map((tourn, index) => (
                    <TournamentCard userID={userID} tourn={tourn}/>
                ))

            ) : (
                <div> No upcoming tournaments. </div>
            )}
        </div>
    )
}
export default TournCardContainer;