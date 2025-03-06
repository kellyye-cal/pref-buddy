import React from 'react'
import {useRef, useState, useEffect, useContext} from 'react';
import AuthContext from "../../context/AuthProvider"
import {Link, useNavigate} from 'react-router-dom'
import { sanitizeInput } from '../Utils';

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
        console.log(axios)

        try {
            const response = await axios.post(`/api/auth/login`, JSON.stringify({email, pwd}), 
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                }
            );
            
            const accessToken = response?.data?.accessToken;
            // const roles = response?.data?.roles;
            const userID = response?.data.userId;
            const name = response?.data.name

            sessionStorage.setItem('accessToken', accessToken);
            sessionStorage.setItem('userId', userID);
            sessionStorage.setItem('name', name)

            setAuth({accessToken, userId: userID, loggedOut: false, name, admin: response?.data?.admin});

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
            console.error(err)
            errRef.current.focus();
        }
    }

    return (
        <>
            <div className="auth-page">
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive"> {errMsg} </p>
                <h1> Welcome to PrefBuddy! </h1>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <h3> Log In</h3>

                    <div className="form-field">
                        <label htmlFor="email"> Email address<span>*</span> </label>
                        <input
                            type="email"
                            id="email"
                            ref={userRef}
                            onChange={(e) => setUser(sanitizeInput(e.target.value))}
                            value={email}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="password"> Password<span>*</span> </label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(sanitizeInput(e.target.value))}
                            value={pwd}
                            required
                        />
                    </div>

                    <button className="cta"> Sign In </button>
                    {/* <p> Don't have an account?
                    <span style={{paddingLeft: 2}}>
                        <Link to="/register"> Sign up instead! </Link>
                    </span> </p> */}
                </form>
            </div>
        </>
    )
}

export default Login