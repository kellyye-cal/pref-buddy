import React, {useEffect, useState} from "react";
import { NavLink } from "react-router-dom";
import TopNav from "./TopNav";

import axios from '../../api/axios'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'


function PublicJudges() {
    const [searchTerm, setSearchTerm] = useState("")
    const [judges, setJudges] = useState([])

    const handleSearch = (e) => {
        e.preventDefault();
        axios.post(`/api/public/search_judges`, {searchTerm},
            {headers: {'Content-Type': 'application/json'}, withCredentials: true}
        ).then((res) => {
            setJudges(res.data);
        }).catch((error) => {
            console.error("Error getting all tournaments: ", error)
        });
    }
    
    return (
        <div>
            <TopNav />
            <div className="public-main">
                <form className="search-bar h-between" style={{padding: "0px 8px", alignItems: "center"}} onSubmit={handleSearch}>
                    <div>
                        <FontAwesomeIcon icon={faMagnifyingGlass} size="xs" style={{marginLeft: 4}}/>
                        <input
                            type='text'
                            placeholder='Search for a judge...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <button className="search-submit" onClick={handleSearch}> Go </button>
                </form>

                {judges.length > 0 ? 
                    <div>
                        <h3> Results for "{searchTerm}": </h3>
                        {judges.map((judge, index) => (
                            <NavLink to={`/public/judges/${judge.id}`} key={index} className="judge-search-results">
                                <div style={{fontWeight: 600}}> {judge.name} </div>
                                <div style={{}}> {judge.affiliation} </div>
                            </NavLink>
                        ))}
                    </div>
                :
                <></>}
            </div>
        </div>
    )
}

export default PublicJudges;