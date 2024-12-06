import React, { useState } from 'react';
import '../App.css';
import '../JudgeProfile.css';

function JudgeProfile() {
    return (
        <div class="main">
            <div>
            <h1 style={{margin: 0}}> Judge Name </h1>
            <h4 style={{margin: 0}}> The College Preparatory School</h4>
            </div>

            <div class="container-spacing container">
                <h3 style={{margin: 0}}> Stats </h3>

                <div class="h-between" style={{marginTop: 8, marginBottom: 8}}>
                    <div class="stat-instance">
                        <h5> Years Judging </h5>
                        <p class="stat-text"> 5 years </p>
                    </div>

                    <div class="stat-instance">
                        <h5> Years in Debate </h5>
                        <p class="stat-text"> 9 years </p>
                    </div>

                    <div class="stat-instance">
                        <h5> Speaker Pt Avg </h5>
                        <p class="stat-text"> 28.8 </p>
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
                <h3 style={{margin: 0}}> Judging History </h3>

            </div>
        </div>
    )
}

export default JudgeProfile;