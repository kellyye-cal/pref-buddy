import React, {useEffect, useState} from "react";
import axios from '../../api/axios'

function UpcomingTourn({j_id}) {
    const [tournaments, setTournaments] = useState([])
    useEffect(() => {
        axios.get(`/api/judges/${j_id}/upcomingTournaments`).then((res) => {
            setTournaments(res.data)
        }).catch((err) => {
            console.error(err)
        })
    }, [j_id])

    return (
        <div className="container container-spacing"
            style={{flexGrow: 1, marginTop: 0}}>
            <h3> Upcoming Tournaments </h3>
            <ul>
                {tournaments.map((t, id) => (
                    <li key={id}> {t.name} </li>
                ))}
            </ul>
        </div>
    )
}

export default UpcomingTourn;