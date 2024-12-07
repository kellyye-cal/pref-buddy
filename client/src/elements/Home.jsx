import React, { useEffect, useState } from 'react';
import {Link, useParams} from "react-router-dom";
import axios from 'axios'
import '../App.css';

import NavBar from './NavBar'

function Home() {
    return (
        <div>
            <NavBar />
        </div>
    )
}

export default Home;