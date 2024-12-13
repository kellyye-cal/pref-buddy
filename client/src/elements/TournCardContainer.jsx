import React, { useEffect, useState } from 'react';
import {Link, useParams} from "react-router-dom";
import axios from 'axios'
import '../App.css';

import TournamentCard from './TournamentCard';



function TournCardContainer({userID}) {
    // GET A LIST OF TOURNAMENTS ATTENDED BY THE USER, THEN MAP IT TO A TOURNAMENT CARD INSTANCE
    const [allTournaments, setData] = useState([]); //to store fetched data

    useEffect(()=>{
        axios.get(`http://localhost:4000/api/tournaments`,
            {params: {u_id:userID}}).then((res) => {
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
                <div> Failed to display tournament information. </div>
            )}
        </div>
    )
}
export default TournCardContainer;