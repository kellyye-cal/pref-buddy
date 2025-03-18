import React, {useState, useEffect} from "react";
import TopNav from "./TopNav";
import axios from '../../api/axios'
import { NavLink } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCheck, faSpinner, faBan} from '@fortawesome/free-solid-svg-icons'

function PublicTournaments() {
    const [tournaments, setTournaments] = useState([]);

    useEffect(() => {
        axios.get(`/api/public/alltournaments`,
            {headers: {'Content-Type': 'application/json'}, withCredentials: true}
        ).then((res) => {
            setTournaments(res.data);
        }).catch((error) => {
            console.error("Error getting all tournaments: ", error)
        });
    }, [])

    return (
        <div>
            <TopNav />
            <div className="public-main">
                <h1> 2024-2025 Tournaments </h1>
                <div className="disclaimer">
                    <div> ❓ </div>

                    <div>
                
                        I'm in the process of scraping rounds for all bid tournaments from the 2024-2025 school year.
                        The status is denoted as follows:

                        <div> <FontAwesomeIcon icon={faCheck} style={{color: "#148943"}}/> : All rounds scraped & all round reports finished </div>
                        <div> <FontAwesomeIcon icon={faSpinner} style={{color: "#f3a72d"}}/> : All rounds scraped but missing round reports </div>
                        <div> <FontAwesomeIcon icon={faBan} style={{color: "#ff2c2c"}}/> : In the process of scraping rounds </div>
                        If you are interesting in contributing information from your rounds, please see this <NavLink to="/contributions" style={{textDecoration: "underline #333 solid 1px"}}> page</NavLink>. 
                    </div>
                </div>
                <table className="table">
                <thead>
                    <tr>
                    <th>Tournament</th>
                    <th>Date</th>
                    <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {tournaments.map((tournament, index) => (
                        <tr key={index}>
                            <td className="tourn-link"> <NavLink target="_blank" and rel="noopener noreferrer" to={`/public/tournaments/${tournament.id}`} key={tournament.id}> {tournament.name} </NavLink> </td>
                            <td>{new Date(tournament.start_date).getMonth() + 1}/{new Date(tournament.start_date).getDate()}/{new Date(tournament.start_date).getFullYear().toString().slice(-2)} - {new Date(tournament.end_date).getMonth() + 1}/{new Date(tournament.end_date).getDate()}/{new Date(tournament.end_date).getFullYear().toString().slice(-2)}</td>
                            <td style={{textAlign: "center", verticalAlign: "center"}}>
                                {tournament.roundsSpecified.total_entries === 0 ?
                                    <FontAwesomeIcon icon={faBan} style={{color: "#ff2c2c"}}/>
                                    : tournament.roundsSpecified.empty > 0 ?
                                    <FontAwesomeIcon icon={faSpinner} style={{color: "#f3a72d"}}/>
                                    :
                                    <FontAwesomeIcon icon={faCheck} style={{color: "#148943"}}/>
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    )
}

export default PublicTournaments;