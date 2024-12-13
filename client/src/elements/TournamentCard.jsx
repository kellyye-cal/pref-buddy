import React, { useEffect, useState } from 'react';
import {Link, useParams} from "react-router-dom";
import axios from 'axios'
import '../App.css';

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
        width: '32%',
        backgroundColor: "#fff",
        padding: '20px 32px 20px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 12,
    }
}


function TournamentCard({tourn}) {
    const startDate = new Date(tourn.start_date)
    const endDate = new Date(tourn.end_date)
    return (
        <div style={styles.container}>
            <p style={styles.tournName}> {tourn.name} </p>
            <p style={styles.tournDate}> {startDate.getMonth() + 1}/{startDate.getDate()}/{startDate.getFullYear().toString().slice(-2)}
                -{endDate.getMonth() + 1}/{endDate.getDate()}/{endDate.getFullYear().toString().slice(-2)}</p>
        </div>
    )
}
export default TournamentCard;