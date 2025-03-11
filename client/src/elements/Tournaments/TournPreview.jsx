import React, {useContext, useState, useEffect} from "react";
import AuthContext from "../../context/AuthProvider";
import axios from '../../api/axios';

import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCheck, faSpinner, faBan} from '@fortawesome/free-solid-svg-icons'

function TournPreview({tournament, index}) {
    const {auth, setAuth} = useContext(AuthContext)

    // first value in prefData is how many are rated, second value is how many total judges
    const [prefData, setPrefData] = useState([])

    const [status, setStatus] = useState(["notAttending"])

    useEffect(()=>{
      axios.get(`/api/tournaments/${tournament.id}`, {
              headers: {
                  Authorization: `Bearer ${auth?.accessToken}`,
              },
              withCredentials: true,}).then((res) => {
            setPrefData(res.data)
      })
      .catch((err)=>console.log("Error getting all judges: ", err))
    }, []);

    useEffect(() => {
        if (tournament.attending === 1 || tournament.judging === 1) {
            if (prefData.numRated === prefData.numTotal) {
                setStatus("complete")
            } else {
                setStatus("pending")
            }
        } else {
            setStatus("notAttending")
        }
    }, [prefData, tournament])

    return (
        <tr key={index}>
                <td className="tourn-link"> <NavLink to={`/tournaments/${tournament.id}`} key={tournament.id}> {tournament.name} </NavLink></td>
                <td>{new Date(tournament.start_date).getMonth() + 1}/{new Date(tournament.start_date).getDate()}/{new Date(tournament.start_date).getFullYear().toString().slice(-2)} - {new Date(tournament.end_date).getMonth() + 1}/{new Date(tournament.end_date).getDate()}/{new Date(tournament.end_date).getFullYear().toString().slice(-2)}</td>
                <td style={{textAlign: "center", verticalAlign: "center"}}> {status === "complete" ? <FontAwesomeIcon style={{color: "#148943"}} icon={faCheck} /> :
                    status === "pending" ? <FontAwesomeIcon style={{color: "#f3a72d"}} icon={faSpinner} /> :
                    <FontAwesomeIcon style={{color: "#ff2c2c"}} icon={faBan} />
                        }
                </td>
              </tr>
    )
}

export default TournPreview;