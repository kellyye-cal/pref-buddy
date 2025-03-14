import React, {useContext, useState, useEffect} from "react";
import NavBar from "../NavBar"
import TournList from "../Tournaments/TournList";
import RoundHistory from "./RoundHistory";
import axios from "../../api/axios";
import AuthContext from "../../context/AuthProvider";

function JudgeHistory({j_id}) {
    const {auth, setAuth} = useContext(AuthContext);
    const [tournaments, setTournaments] = useState([]);

    var past;
    var upcoming;
    const now = new Date();

    useEffect(() => {
        axios.get(`/api/tournaments/judgingat`, {headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
        }}
        ).then((res) => {
            setTournaments(res.data)
        }).catch((err)=>console.log("Error getting all tournaments: ", err))
    }, [auth])

    upcoming = tournaments.filter((tourn) => {
        const end = new Date(tourn.end_date)
        return (now > end)
    })

    past = tournaments.filter((tourn) => {
        const end = new Date(tourn.end_date)

        return (now < end)
    })
    

    return (
        <div className="page">
            <NavBar />
            <div className="main v-scroll">
                <div className="h-between" style={{alignItems: "center"}}>
                    <h1> Past Judging </h1>
                </div>

                <h2 style={{marginTop: 12}}> Upcoming </h2>
                <TournList data={upcoming} sortOrder={"asc"} view={"judging"}/>

                <h2 style={{marginTop: 20}}> Past </h2> 
                <TournList data={past} sortOrder={"dsc"} view={"judging"}/>
            </div>
        </div>
    )
}

export default JudgeHistory