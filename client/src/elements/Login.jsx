import React from 'react'
import {useRef, useState, useEffect, useContext} from 'react';
import AuthContext from "../context/AuthProvider"

import axios from '../api/axios';
const LOGIN_URL = '/auth';

function Login() {
    const {setAuth} = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setsuccess] = useState('');
    
    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleSubmit = async(e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL, JSON.stringify({user, pwd}), 
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
            
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;

            setAuth({user, pwd, roles, accessToken});

            setUser('');
            setPwd('');
            setsuccess(true);
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
            {success ? (
                <section>
                    <h1> You are logged in! </h1>
                </section>
            ) : (

                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive"> {errMsg} </p>
                    <h1> Sign In</h1>

                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email"> Email address </label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            onChange={(e) => setUser(e.target.value)}
                            value={user}
                            required
                        />


                        <label htmlFor="password"> Password </label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                        />

                        <button> Sign In </button>
                    </form>
                    <p> Don't have an account?
                        <span>
                            {/* put router link here instead of html link */}
                            <a href="#"> Sign up instead! </a></span></p>
                </section>
            )}
        </>
    )
}

export default Login