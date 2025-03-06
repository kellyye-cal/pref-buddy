import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';
import axios from '../api/axios';
import '../App.css';

import ProgressRing from './ProgressRing';


const styles = {
    tournName: {
        fontSize: 16,
        fontWeight: 700,
        margin: 0,
        width: '100%',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textAlign: 'center'
    },
    tournDate: {
        fontSize: 16,
        fontWeight: 500,
        margin: 0
    },
    container: {
        flex: "1 0 30%",
        backgroundColor: "#fff",
        padding: '20px 32px 20px 32px',
        // margin: '8px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 12,
        overflow: 'hidden',
    }
}


function TournamentCard({userID, tourn}) {
    const {auth} = useContext(AuthContext);

    const startDate = new Date(tourn.start_date)
    const endDate = new Date(tourn.end_date)
    
    const [prefData, setData] = useState([])

    useEffect(()=>{
        axios.get(`api/tournaments/${tourn.tournament_id}`, {
                headers: {
                    Authorization: `Bearer ${auth?.accessToken}`,
                },
                withCredentials: true,}).then((res) => {
            setData(res.data);
        })
        .catch((err)=>console.log("Error getting all judges: ", err))
    }, []);

    // for each tournament, get number of judges attending and number of judges ranked using tourn.i

    return (
        <Link className="container-hover" to={`/tournaments/${tourn.tournament_id}`} style={styles.container}>
            <ProgressRing progress={prefData.numRated} full={prefData.numTotal}/>
            <p style={{fontSize: 14, paddingTop: 4}}> judges rated</p>
            <p className="link" style={styles.tournName}> {tourn.name} </p>
            <p style={styles.tournDate}> {startDate.getMonth() + 1}/{startDate.getDate()}/{startDate.getFullYear().toString().slice(-2)}
                -{endDate.getMonth() + 1}/{endDate.getDate()}/{endDate.getFullYear().toString().slice(-2)}</p>
        </Link>
    )
}
export default TournamentCard;