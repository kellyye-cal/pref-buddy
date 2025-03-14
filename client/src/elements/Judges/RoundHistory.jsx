import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../../context/AuthProvider';
import axios from '../../api/axios';
import RoundType from '../Tournaments/RoundType';

function RoundHistory({j_id}) {
    const {auth} = useContext(AuthContext);
    const [rounds, setRounds] = useState([])

    useEffect(() => {
        axios.get(`/api/judges/${j_id}/rounds`, {
            headers: {
                Authorization: `Bearer ${auth?.accessToken}`,
            },
            withCredentials: true}
        ).then((res) => {
            const sortedRounds = res.data.sort((a, b) => {
                return new Date(b.start_date) - new Date(a.start_date); // for ascending order
            });

            setRounds(sortedRounds)
        }).catch((err)=>console.log("Error getting all judges: ", err))
    }, [])

    

    return (
        <div className="container container-spacing">
            <h3> Round History </h3>

        <table className="table round-history">
          <thead>
            <tr>
                <th>Tournament</th>
                <th>R#</th>
                <th>Aff</th>
                <th>Neg</th>
                <th> Vote </th>
                <th>Panel</th>
                <th>Type</th>

            </tr>
          </thead>
          <tbody>
            {rounds.map((round, index) => (
                <tr key={index} className="round">
                    <td> {round.name}</td>
                    <td> {round.number}</td>
                    <td> {round.aff}</td>
                    <td> {round.neg}</td>
                    <td> {round.decision}</td>
                    <td style={{maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}> {round.elim_decision ? round.elim_decision : "--"}</td>
                    <td style={{width: 155}}> <RoundType t_id={round.tournament_id} round={round.number} j_id={round.judge_id} type={round.round_type}/> </td>
                </tr>
            ))}
          </tbody>
        </table>
        </div>
    )
}

export default RoundHistory