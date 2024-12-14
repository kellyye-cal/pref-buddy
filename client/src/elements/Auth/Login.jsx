import React from 'react'
import {useRef, useState, useEffect, useContext} from 'react';
import AuthContext from "../../context/AuthProvider"
import {Link} from 'react-router-dom'


import './Auth.css';

import axios from '../../api/axios';
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
                                value={user}
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
            )}
        </>
    )
}

export default Login