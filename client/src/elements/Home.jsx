import React, { useEffect, useState } from 'react';
import {Link, useParams} from "react-router-dom";
import axios from 'axios'
import '../App.css';

import NavBar from './NavBar'
import TournCardContainer from './TournCardContainer';

function Home() {
    // Get the list of tournaments we are attending
    
    return (
        <div class="page">
            <NavBar />
            <div class="main">
                <h1> Hi, Kelly! </h1>
                <h2> Upcoming Tournaments</h2>
                <TournCardContainer userID={0}/>
            </div>
        </div>
    )
}

export default Home;