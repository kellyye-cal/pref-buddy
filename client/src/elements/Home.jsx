import React, { useEffect, useState, useContext } from 'react';
import {Link, useParams} from "react-router-dom";
import axios from 'axios'
import '../App.css';
import AuthContext from '../context/AuthProvider';

import NavBar from './NavBar'
import TournCardContainer from './TournCardContainer';

function Home() {
    const {auth} = useContext(AuthContext);
    const {userID} = useParams();

    return (
        <div class="page">
            <NavBar />
            <div class="main">
                <h1> Hi! </h1>
                <h2> Upcoming Tournaments</h2>
                <TournCardContainer userID={userID}/>
            </div>
        </div>
    )
}

export default Home;