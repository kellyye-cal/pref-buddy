import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from '../../api/axios'
import ReactMarkdown from 'react-markdown';

import TopNav from "./TopNav";
import RoundDisplay from "../Tournaments/RoundDisplay";



function PublicJudgePage() {
    const { id } = useParams();

    const [judgeInfo, setJudgeInfo] = useState([]);
    const [rounds, setRounds] = useState([]);
    const [stats, setStats] = useState({});

    useEffect(() => {
        axios.get(`/api/public/judges/${id}`,
            {headers: {'Content-Type': 'application/json'}, withCredentials: true}
        ).then((res) => {
            setJudgeInfo(res.data.judgeInfo[0]);
            setRounds(res.data.rounds);
            setStats(res.data.stats);
        }).catch((error) => {
            console.error("Error getting all tournaments: ", error)
        });
    }, []) 

    console.log(stats)

    return (
        <div>
            <TopNav />
            
            
            <div class="public-main">
                <div>
                    <h1> {judgeInfo.f_name + ' ' + judgeInfo.l_name} </h1>
                    <h4> {judgeInfo.affiliation}</h4>
                </div>

                <div className="container-spacing container">
                    <h3 style={{margin: 0}}> Stats </h3>

                    <div className="h-between" style={{marginTop: 8, marginBottom: 8, flexWrap: "wrap", gap: 8}}>
                        <div className="stat-instance">
                            <h5> Speaker Pt Avg </h5>
                            <p className="stat-text"> {stats.avgSpeaks} </p>
                        </div>
                    </div>

                    {Object.keys(stats).length > 0 ? 
                        <div style={{marginTop: 8, marginBottom: 8}}>
                            <div className="stat-instance">
                                    <h5> 24-25 Topic Round Stats </h5>

                                    <p className="stat-text"> <span> Pol v. Pol ({stats.PvP.Aff}-{stats.PvP.Neg}) : </span> {Math.round(stats.PvP.Aff / (stats.PvP.Aff + stats.PvP.Neg) * 100)}% aff over {(stats.PvP.Aff + stats.PvP.Neg)} rounds </p>
                                    <p className="stat-text"> <span> Pol v. K ({stats.PvK.Aff}-{stats.PvK.Neg}) : </span> {Math.round(stats.PvK.Aff / (stats.PvK.Aff + stats.PvK.Neg) * 100)}% aff over {(stats.PvK.Aff + stats.PvK.Neg)} rounds </p>
                                    <p className="stat-text"> <span> K v. Pol ({stats.KvP.Aff}-{stats.KvP.Neg}) : </span> {Math.round(stats.KvP.Aff / (stats.KvP.Aff + stats.KvP.Neg) * 100)}% aff over {(stats.KvP.Aff + stats.KvP.Neg)} rounds </p>
                                    <p className="stat-text"> <span> K v. K ({stats.KvK.Aff}-{stats.KvK.Neg}) : </span> {Math.round(stats.KvK.Aff / (stats.KvK.Aff + stats.KvK.Neg) * 100)}% aff over {(stats.KvK.Aff + stats.KvK.Neg)} rounds </p>
                                    <p className="stat-text"> <span> T/Theory ({stats.T.Aff}-{stats.T.Neg}) : </span> {Math.round(stats.T.Aff / (stats.T.Aff + stats.T.Neg) * 100)}% aff over {(stats.T.Aff + stats.T.Neg)} rounds </p>

                            </div>
                        </div>
                    : <></> }
                </div>

                <div className="container container-spacing">
                    <h3> Round History</h3>
                    <RoundDisplay rounds={rounds} displayTournament={true} displayJudge={false} publicView={true} judgeLink={""} groupElims={false} />
                </div>

                <div className="container container-spacing">
                    <h3> Paradigm </h3>
                    <div className="v-scroll"> <ReactMarkdown children={judgeInfo.paradigm}/> </div> 
                </div>
            </div>
        </div>
    )
}

export default PublicJudgePage