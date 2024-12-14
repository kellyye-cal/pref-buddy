import { useRef, useState, useEffect } from "react";

import axios from '../api/axios'


const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ'-]+$/;


// one upper case, one lower case, one number, one special symbol, 8-24 chars

const Register = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    // const [emailFocus, setEmailFocus] = useState(false);

    const [fname, setFname] = useState('');
    const [validFname, setValidFname] = useState(false);
    // const [fnameFocus, setFnameFocus] = useState(false);

    const [lname, setLname] = useState('');
    const [validLname, setValidLname] = useState(false);
    // const [lnameFocus, setLnameFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    // const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    // const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    // useEffect(() => {
    //     userRef.current.focus();
    // }, [])

    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        setValidEmail(result)
    }, [email])

    useEffect(() => {
        const result = NAME_REGEX.test(fname);
        setValidFname(result)
    }, [fname])

    useEffect(() => {
        const result = NAME_REGEX.test(lname);
        setValidLname(result)
    }, [lname])

    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        console.log(result);
        console.log(pwd);
        setValidPwd(result)
        const match = pwd === matchPwd;
        setValidMatch(match);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const v1 = EMAIL_REGEX.test(email);
        const v2 = PWD_REGEX.test(pwd);
        const v3 = NAME_REGEX.test(fname)
        const v4 = NAME_REGEX.test(lname)

        if (!v1 || !v2 || !v3 || !v4) {
            setErrMsg("InvalidEntry");
            return;
        }

        try {
            const response = await axios.post('/register', 
                JSON.stringify({email, fname, lname, pwd}),
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                }
            );
            console.log(response.data)
            // console.log(response.accessToken)
            // setSuccess(true);

            //TODO: clear the input fields out of the registration field
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No response from server')
            } else if (err.response?.status === 409) {
                setErrMsg('Already have an account with that email address')
            } else {
                setErrMsg('Registration failed')
            }
            // errRef.current.focus();
        }
    }

    return (
        <>
        {success ? (
            <h1> Success!</h1>
        ) : (
            <div>
                <p ref={errRef} className={errMsg ? "errMsg" : "offscreen"} aria-live="assertive"> {errMsg} </p>
                <h2> Create an Account </h2>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="email"> Email Address </label>
                    <input
                        type="text"
                        id="email"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        aria-invalid={validEmail ? "false": "true"}
                        aria-describedby="uidnote"
                        // onFocus={() => setEmailFocus(true)}
                        // onBlur={() => setEmailFocus(false)}
                    />
                    <p id="uidnote" className={email && !validEmail ? "instructions" : "offscreen"}> Enter a valid email.</p>

                    <label htmlFor="fname"> First Name</label>
                    <input
                        type="text"
                        id="fname"
                        // ref={userRef}
                        autoComplete="off"
                        onChange={(e) => setFname(e.target.value)}
                        required
                        aria-invalid={validFname ? "false": "true"}
                        aria-describedby="fnamenote"
                        // onFocus={() => setFnameFocus(true)}
                        // onBlur={() => setFnameFocus(false)}
                    />
                    <p id="fnamenote" className={fname && !validFname ? "instructions" : "offscreen"}> Enter a first name.</p>

                    <label htmlFor="lname"> Last name </label>
                    <input
                        type="text"
                        id="lname"
                        // ref={userRef}
                        autoComplete="off"
                        onChange={(e) => setLname(e.target.value)}
                        required
                        aria-invalid={validLname ? "false": "true"}
                        aria-describedby="lnamenote"
                        // onFocus={() => setLnameFocus(true)}
                        // onBlur={() => setLnameFocus(false)}
                    />
                    <p id="lnamenote" className={lname && !validLname ? "instructions" : "offscreen"}> Enter a last name.</p>

                    <label htmlFor="password">Password </label>
                    <input
                        type="password"
                        id="password"
                        onChange={(e) => setPwd(e.target.value)}
                        required
                        aria-invalid={validPwd ? "false": "true"}
                        aria-describedby="pwdnote"
                        // onFocus={() => setPwdFocus(true)}
                        // onBlur={() => setPwdFocus(false)}
                    />
                    <p id="pwdnote" className={!validPwd ? "instructions" : "offscreen"}>
                        Enter a valid password. <br/> 
                        Must include uppercase and lowercase letters, a number, and a special character (!@#$%)
                    </p>

                    <label htmlFor="confirm_pwd"> Confirm Password </label>
                    <input
                        type="password"
                        id="confirm_pwd"
                        onChange={(e) => setMatchPwd(e.target.value)}
                        required
                        aria-invalid={validMatch ? "false": "true"}
                        aria-describedby="confirmnote"
                        // onFocus={() => setMatchFocus(true)}
                        // onBlur={() => setMatchFocus(false)}
                    />
                    <p id="confirmnote" className={!validMatch ? "instructions" : "offscreen"}>
                        Confirm your passwords match.
                    </p>

                    <button disabled={!validEmail || !validFname || !validLname || !validPwd || !validMatch ? true : false}>
                        Create Account
                    </button>
                </form>

                <p> Already have a account? Sign In</p>

            </div>
        )}
        </>
    )
}

export default Register