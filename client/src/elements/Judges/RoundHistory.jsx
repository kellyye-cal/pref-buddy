import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../../context/AuthProvider';
import axios from '../../api/axios';
import RoundType from '../Tournaments/RoundType';
import RoundDisplay from '../Tournaments/RoundDisplay';

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

        <RoundDisplay rounds={rounds} displayTournament={true}/>
        </div>
    )
}

export default RoundHistory