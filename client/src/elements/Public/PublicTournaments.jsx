import React, {useState, useEffect} from "react";
import TopNav from "./TopNav";
import axios from '../../api/axios'
import { NavLink } from "react-router-dom";

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

    console.log(tournaments)
    return (
        <div>
            <TopNav />
            <div className="public-main">
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
                            <td className="tourn-link"> <NavLink to={`/public/tournaments/${tournament.id}`} key={tournament.id}> {tournament.name} </NavLink> </td>
                            <td>{new Date(tournament.start_date).getMonth() + 1}/{new Date(tournament.start_date).getDate()}/{new Date(tournament.start_date).getFullYear().toString().slice(-2)} - {new Date(tournament.end_date).getMonth() + 1}/{new Date(tournament.end_date).getDate()}/{new Date(tournament.end_date).getFullYear().toString().slice(-2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    )
}

export default PublicTournaments;