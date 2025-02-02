import React, { useEffect, useState, useContext } from 'react';
import {useParams} from "react-router-dom";
import axios from 'axios'
import '../../App.css';
import './JudgeProfile.css';

import NavBar from '../NavBar'
import Rating from './Rating'
import EditRating from './EditRating';
import AuthContext from '../../context/AuthProvider';

import ReactMarkdown from 'react-markdown';

function JudgeProfile() {
    const {auth, setAuth} = useContext(AuthContext);

    const [judgeData, setJudgeData] = useState([]); //to store fetched data
    const [paradigm, setParadigm] = useState(["No paradigm."]);
    const { id } = useParams();

    useEffect(()=>{
        axios.get(`http://localhost:4000/api/judges/${id}`, {params:{u_id: auth.userId}, headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
        }}).then((res) => {
            setJudgeData(res.data.judgeInfo);

            setParadigm(res.data.paradigm)
        })
        .catch((err)=>console.log(err))
    }, []);

    function updateRating(judgeID, newRating) {
        axios.post(`http://localhost:4000/api/judges/set_rating`, {
            u_id: auth.userId,
            j_id: judgeID,
            rating: newRating
        }, {headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
        }}).then(() => {
            setJudgeData(prevJudges => prevJudges.map(judge => 
                judge.id === judgeID ? {...judge, rating: newRating} : judge
            ));
        }).catch((err) => console.error("Error saving rating:", err));

        axios.get(`http://localhost:4000/api/judges/${id}`, {params:{u_id: auth.userId}, headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
        }}).then((res) => {
            setJudgeData(res.data);
        })
        .catch((err)=>console.log(err))
    }

    return (
        <div className="page">
            <NavBar />
            <div className="main" style={{overflowY: "auto"}}>
                <div>
                    {judgeData && judgeData.length > 0 ? (
                        judgeData.map((judge, index) => (
                            <div>
                                <div className="judgeProfTitle">
                                    <div>
                                        <h1> {judge.name} </h1>
                                        <h4> {judge.affiliation}</h4>
                                    </div>

                                    <div className="ratingContainer">
                                        <Rating rating={judge.rating}/>

                                        <EditRating userID={auth.userId} judgeID={judge.judge_id} updateFunc={updateRating} currRating={judge.rating}/>

                                    </div>
                                </div>

                                <div className="container-spacing container">
                                    <h3 style={{margin: 0}}> Stats </h3>

                                    <div className="h-between" style={{marginTop: 8, marginBottom: 8}}>
                                        <div className="stat-instance">
                                            <h5> Years Judging </h5>
                                            <p className="stat-text"> {judge.yrs_judge} </p>
                                        </div>

                                        <div className="stat-instance">
                                            <h5> Years in Debate </h5>
                                            <p className="stat-text"> {judge.yrs_dbt} </p>
                                        </div>

                                        <div className="stat-instance">
                                            <h5> Speaker Pt Avg </h5>
                                            <p className="stat-text"> -- </p>
                                        </div>
                                    </div>

                                    <div style={{marginTop: 8, marginBottom: 8}}>
                                    <div className="stat-instance">
                                            <h5> 24-25 Topic Round Stats </h5>
                                            <p className="stat-text"> -- </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="container container-spacing">
                                    <h3> Paradigm </h3>
                                    <div className="v-scroll"> <ReactMarkdown children={paradigm}/> </div> 
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>
                            <p> Loading... </p>
                        </div>

                    )}
                </div>

            </div>
        </div>
    )
}

export default JudgeProfile;