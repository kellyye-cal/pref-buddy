import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from '../../api/axios'
import ReactMarkdown from 'react-markdown';

import TopNav from "./TopNav";
import Badges from "../Judges/Badges";
import RoundDisplay from "../Tournaments/RoundDisplay";
import { FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faQuestionCircle} from '@fortawesome/free-regular-svg-icons'
import UpcomingTourn from "../Judges/UpcomingTourn";


function PublicJudgePage() {
    const { id } = useParams();

    const [judgeInfo, setJudgeInfo] = useState([]);
    const [rounds, setRounds] = useState([]);
    const [stats, setStats] = useState({});

    const [communityStats, setCommunityStats] = useState({});
    const [elimsStats, setElimsStats] = useState({})

    useEffect(() => {
        axios.get(`/api/public/judges/${id}`,
            {headers: {'Content-Type': 'application/json'}, withCredentials: true}
        ).then((res) => {
            setJudgeInfo(res.data.judgeInfo[0]);
            const sortedRounds = res.data.rounds.sort((a, b) => {
                return (new Date(a.start_date) - new Date(b.start_date))
            })
            setRounds(sortedRounds);
            setStats(res.data.stats);
        }).catch((error) => {
            console.error("Error getting all tournaments: ", error)
        });

        axios.get("/api/public/community_stats").then((res) =>
            setCommunityStats(res.data) 
        ).catch ((err) => {
            console.error(err)
        })

    }, []) 

    useEffect(() => {
        var numElims = 0;
        var timeSat = 0;
        rounds.map((round) => {
            if (isNaN(parseInt(round.number))) {
                numElims += 1;
    
                if (round.elim_decision != round.decision) {
                    timeSat += 1;
                }
            }
        })

        setElimsStats({numElims, timeSat})
    }, [rounds])

    const pointDifference = (stats.avgSpeaks - communityStats.avg).toFixed(1)

    return (
        <div>
            <TopNav />
        
            <div className="public-main">
                <div>
                    <a className="hover-link" target="_blank" rel="noopener noreferrer" href={`https://www.tabroom.com/index/paradigm.mhtml?judge_person_id=${id}`}>
                        <h1 style={{marginBottom: 0}}> {judgeInfo.f_name + ' ' + judgeInfo.l_name} </h1>
                    </a>
                    <h4> {judgeInfo.affiliation}</h4>
                </div>

                <div style={{display: "flex", gap: 12, height: "100%"}}>
                    <div className="container-spacing container">
                        <div className="h-between align-center">
                            <h3 style={{margin: 0}}> Stats </h3>
                            <div className="tooltip-container">
                                <span className="tooltip-text">
                                    The speaker point average is calculated from rounds at bid tournaments during the 2024-2025 season.
                                    <br />
                                    <br />
                                    The stats are calculated based on round reports submitted by the community. To contribute, see the "Contribute" page.
                                </span>
                                <FontAwesomeIcon icon={faQuestionCircle}/>
                            </div>
                        </div>

                        <div className="h-between" style={{marginTop: 8, marginBottom: 8, flexWrap: "wrap", gap: 8}}>
                            <div className="stat-instance">
                                <h5> Speaks Avg </h5>
                                <p className="stat-text">
                                    {stats.avgSpeaks ? (`${stats.avgSpeaks}`) : ("--")}
                                    {stats.avgSpeaks && pointDifference >= 0 ?
                                        <span style={{color: "#148943", fontWeight: 500}}> +{pointDifference} community μ</span>
                                    : stats.avgSpeaks ?
                                        <span style={{color: "#FF3737", fontWeight: 500}}> {pointDifference} community μ</span>
                                    : <span> </span>
                                }
                                </p>
                            </div>

                            <div className="stat-instance">
                                <h5> SD </h5>
                                <p className="stat-text">
                                    {stats.speaksSD ? (`${stats.speaksSD}`) : ("--")}
                                </p>
                            </div>

                            <div className="stat-instance">
                                <h5> Total Rounds </h5>
                                <p className="stat-text">
                                    {rounds.length}
                                </p>
                            </div>


                            <div className="stat-instance">
                                <h5> Elims Judged </h5>
                                <p className="stat-text">
                                    {elimsStats.numElims}
                                    <span 
                                        style={{color: `${elimsStats.timeSat < (elimsStats.numElims / 2) ? "#148943" : "#FF3737"}`}}
                                        > sat {elimsStats.timeSat}x
                                    </span>
                                </p>
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

                    <div 
                        style={{minWidth: "40%", maxWidth: 400, 
                        height: "100%", gap: 12, flexGrow: 1,
                        display: "flex", flexDirection: "column"}}>

                        <Badges rounds={rounds} j_id={id}/>
                        <UpcomingTourn j_id={id} /> 
                    </div>
                </div>

                <div className="container container-spacing">
                    <div className="h-between align-center">
                        <h3 style={{margin: 0}}> Past Rounds </h3>
                        <div className="tooltip-container">
                            <span className="tooltip-text">
                                Rounds are scraped from tabroom.com for the 2024-2025 school year.
                                <br />
                                <br />
                                Round reports are submitted by the community. See the "Contribute" page if you want to help out.
                            </span>
                            <FontAwesomeIcon icon={faQuestionCircle}/>
                        </div>
                    </div>
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