import React, {useContext, useState, useEffect} from "react";
import AuthContext from "../../context/AuthProvider";
import axios from "../../api/axios";

import RoundType from "../Tournaments/RoundType";


function UnspecifiedRoundHistory({j_id}) {
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

    const unspecified = rounds.filter(round => !round.round_type)
    const grouped = unspecified.reduce((acc, obj) => {
        if (!acc[obj.name]) {
            acc[obj.name] = []
        }
        acc[obj.name].push(obj)
        return acc;
    }, {});

    

    return (
        <div>
            {Object.entries(grouped).map(([name, objects]) => (
                <div key={name} className="container container-spacing">
                    <h5> {name} </h5>
                    <table className="table round-history">
                        <thead>
                            <tr>
                                <th>R#</th>
                                <th>Aff</th>
                                <th>Neg</th>
                                <th> Vote </th>
                                <th>Panel</th>
                                <th>Type</th>

                            </tr>
                        </thead>
                        <tbody>
                            {objects.map((r, index) => (
                                <tr key={index} className="round">
                                    <td> {r.number}</td>
                                    <td> {r.aff}</td>
                                    <td> {r.neg}</td>
                                    <td> {r.decision}</td>
                                    <td style={{maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}> {r.elim_decision ? r.elim_decision : "--"}</td>
                                    <td style={{width: 155}}> <RoundType t_id={r.tournament_id} round={r.number} j_id={r.judge_id} type={r.round_type}/> </td>
                                </tr>
                            ))}
                        </tbody>
                        </table>
                </div>
            ))}
            
        </div>
    )
}

export default UnspecifiedRoundHistory;