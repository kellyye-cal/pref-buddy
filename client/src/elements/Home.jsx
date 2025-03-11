import React, {useContext } from 'react';
import {useParams} from "react-router-dom";
import '../App.css';
import AuthContext from '../context/AuthProvider';

import NavBar from './NavBar'
import TournCardContainer from './TournCardContainer';
import AddTournament from './Tournaments/AddTournament';

function Home() {
    const {auth} = useContext(AuthContext);
    const {userID} = useParams();

    const firstName = auth.name.split(' ')[0]

    return (
        <div className="page">
            <NavBar />
            <div className="main">
                <h1> Hi, {firstName}! </h1>
                <div className="h-between">
                    <h2> Upcoming Tournaments</h2>
                    <AddTournament />
                </div>
                <TournCardContainer userID={userID}/>
            </div>
        </div>
    )
}

export default Home;