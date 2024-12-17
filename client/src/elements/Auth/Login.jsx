import React from 'react'
import {useRef, useState, useEffect, useContext} from 'react';
import AuthContext from "../../context/AuthProvider"
import {Link, useNavigate} from 'react-router-dom'

import './Auth.css';

import axios from '../../api/axios';



function Login() {
    const {setAuth} = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const [email, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setsuccess] = useState('');

    const navigate = useNavigate();
    
    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd])

    const handleSubmit = async(e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/auth', JSON.stringify({email, pwd}), 
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                }
            );
            
            const accessToken = response?.data?.accessToken;
            // const roles = response?.data?.roles;
            const userID = response?.data.userId;

            sessionStorage.setItem('accessToken', accessToken);
            sessionStorage.setItem('userId', userID);

            setAuth({email, accessToken, userId: userID, loggedOut: false});

            setUser('');
            setPwd('');
            setsuccess(true);

            navigate(`/home/${userID}`, {replace: true})
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status ===400) {
                setErrMsg('Missing Username or Password')
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed')
            }
            errRef.current.focus();
        }
    }

    return (
        <>
            <div class="auth-page">
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive"> {errMsg} </p>
                <h1> Welcome to PrefBuddy! </h1>

                <form class="auth-form" onSubmit={handleSubmit}>
                    <h3> Log In</h3>

                    <div class="form-field">
                        <label htmlFor="email"> Email address<span>*</span> </label>
                        <input
                            type="email"
                            id="email"
                            ref={userRef}
                            onChange={(e) => setUser(e.target.value)}
                            value={email}
                            required
                        />
                    </div>

                    <div class="form-field">
                        <label htmlFor="password"> Password<span>*</span> </label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                        />
                    </div>

                    <button class="cta"> Sign In </button>
                    <p> Don't have an account?
                    <span style={{paddingLeft: 2}}>
                        <Link to="/"> Sign up instead! </Link>
                    </span> </p>
                </form>
            </div>
        </>
    )
}

export default Login