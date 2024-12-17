import React from 'react'
import {useRef, useState, useEffect, useContext} from 'react';
import AuthContext from "../../context/AuthProvider"
import {Link, useNavigate} from 'react-router-dom'

import './Auth.css';

import axios from '../../api/axios';


function Logout() {
    const navigate = useNavigate()
    
    // send post request to /logout with credentials
    // example: const response = await axios.post('/auth/refresh', {}, {
    //     withCredentials: true, // Send cookies with the request
    //   });

    //delete the access token an d userIdfrom auth state and session storage
    // DO I NEED TO REMOVE REFRESH TOKEN COOKIE?
    const {auth, setAuth} = useContext(AuthContext);

    try {
        const response = axios.post('/auth/logout', { u_id: auth.userId }, {headers: {Authorization: `Bearer ${auth?.accessToken}`}, withCredentials: true})
    } catch (err) {
        console.error("Error logging out: ", err)
    }

    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('userId');

    setAuth({email: null, accessToken: null, userId: null, loggedOut: true});

    navigate('/login');

}

export default Logout;