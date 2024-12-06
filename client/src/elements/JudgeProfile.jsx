import React, { useEffect, useState } from 'react';
import axios from 'axios'
import '../App.css';
import '../JudgeProfile.css';

function JudgeProfile() {
    const [judgeData, setJudgeData] = useState([]); //to store fetched data
    useEffect(()=>{
        axios.get('http://localhost:4000/api/judge/').then((res) => {
            console.log("successfully posted get request");
            setJudgeData(res.data);
        })
        .catch((err)=>console.log(err))
    }, []);

    return (
        <div class="main">
            <div>
                {judgeData && judgeData.length > 0 ? (
                    judgeData.map((judge, index) => (
                        <div>
                            <h1> {judge.name} </h1>
                            <h4> {judge.affiliation}</h4>

                            <div class="container-spacing container">
                                <h3 style={{margin: 0}}> Stats </h3>

                                <div class="h-between" style={{marginTop: 8, marginBottom: 8}}>
                                    <div class="stat-instance">
                                        <h5> Years Judging </h5>
                                        <p class="stat-text"> -- </p>
                                    </div>

                                    <div class="stat-instance">
                                        <h5> Years in Debate </h5>
                                        <p class="stat-text"> -- </p>
                                    </div>

                                    <div class="stat-instance">
                                        <h5> Speaker Pt Avg </h5>
                                        <p class="stat-text"> -- </p>
                                    </div>
                                </div>

                                <div style={{marginTop: 8, marginBottom: 8}}>
                                <div class="stat-instance">
                                        <h5> 24-25 Topic Round Stats </h5>
                                        <p class="stat-text"> 5 years </p>
                                        <p class="stat-text"> 5 years </p>
                                        <p class="stat-text"> 5 years </p>
                                        <p class="stat-text"> 5 years </p>
                                        <p class="stat-text"> 5 years </p>
                                    </div>
                                </div>
                            </div>

                            <div class="history container container-spacing">
                                <h3 style={{margin: 0}}> Judge Information </h3>

                            </div>
                        </div>
                    ))
                ) : (
                    <div>
                        <p> failed to load resource </p>
                    </div>

                )}
            </div>

        </div>
    )
}

export default JudgeProfile;