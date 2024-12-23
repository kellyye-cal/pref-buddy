import React from 'react'
import {useRef, useState, useEffect, useContext} from 'react';
import AuthContext from "../../context/AuthProvider"
import {Link, useNavigate} from 'react-router-dom'
import useAuth from '../../hooks/useAuth';

import './Auth.css';

import axios from '../../api/axios';


function Logout() {
    const navigate = useNavigate()
    const {auth, setAuth} = useContext(AuthContext);
    const {clearAuthState} = useAuth();

    const handleLogout = async() => {

        try {
            const response = await axios.post('/auth/logout', { u_id: auth.userId }, {headers: {Authorization: `Bearer ${auth?.accessToken}`}, withCredentials: true})
            
            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('userId');
    
            setAuth({email: null, accessToken: null, userId: null, loggedOut: true});
    
            navigate('/login');
        } catch (err) {
            console.error("Error logging out: ", err)
        }
    }

    handleLogout();
    return null;

}

export default Logout;