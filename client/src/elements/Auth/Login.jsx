import React from 'react'
import {useRef, useState, useEffect, useContext} from 'react';
import AuthContext from "../../context/AuthProvider"
import {useNavigate} from 'react-router-dom'
import { sanitizeInput } from '../Utils';

import './Auth.css';

import axios from '../../api/axios';
import TopNav from '../Public/TopNav';

function Login() {
    const {auth, setAuth} = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const [email, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setsuccess] = useState(false);
    const [loggingIn, setLoggingIn] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd])

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoggingIn(true);

        try {
            const response = await axios.post(`/api/auth/login`, JSON.stringify({email, pwd}), 
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                }
            );
            
            const accessToken = response?.data?.accessToken;
            // const roles = response?.data?.roles;
            const userID = response?.data.userId
            const name = response?.data.name

            sessionStorage.setItem('accessToken', accessToken);
            sessionStorage.setItem('userId', response?.data.userId);
            sessionStorage.setItem('name', name)

            setAuth({accessToken, userId: userID, loggedOut: false, name, admin: response?.data?.admin, judge: response?.data?.judge});

            setUser('');
            setPwd('');
            setsuccess(true);

            setTimeout(() => {
                navigate(`/home/${response?.data.userId}`);
            }, 1000);
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
        }
    }

    const tryAgain = () => {
        setLoggingIn(false);
    }

    return (
        <div>
            <TopNav />
            <div className="auth-page">
                <h1> Welcome to PrefBuddy! </h1>

                {!loggingIn ?
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <h3> Dashboard Log In</h3>
                        <p> For now, this is reserved for students at College Prep. If you'd like to try out the features, you can <a 
                                href="mailto:kelly@college-prep.org?subject=Pref Buddy Access"
                                style={{color: "#2680FF", fontWeight: 500, textDecoration: "underline solid #2680FF 1.25px"}}> send me an email. </a>
                        </p>

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
                    :
                    <form className="auth-form" onSubmit={tryAgain}>
                        <h3> {errMsg} </h3>
                        <p style={{textAlign: "center"}}> Make sure your login credentials are correct. </p>
                        <button style={{color: "#2680FF", fontWeight: 600, textDecoration: "#2680FF underline 1px"}}> Try again </button>
                    </form>
                }   
            </div>
        </div>
    )
}

export default Login