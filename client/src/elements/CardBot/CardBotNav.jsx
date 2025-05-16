import React, {useContext, useState, useEffect} from 'react';
import cardbotClient from '../../api/cardbotClient';
import {NavLink} from "react-router-dom";

import AuthContext from '../../context/AuthProvider';

function CardBotNav() {
    const {auth} = useContext(AuthContext);
    const [topics, setTopics] = useState([]);

    useEffect(() => {
        cardbotClient.get(`/api/my-topics/${auth.userId}`).then((res) => {
            setTopics(res.data)
        }).catch((err) => {console.error(err)})
    }, [auth.userId])

    return (
        <div style={{
            backgroundColor: "#ECEFF6",
            width: 160,
            padding: "32px 12px"
        }}>
            <h3> CardBot </h3>

            <div style={{
                fontWeight: 700
            }}>
                <div> My Topics </div>
            </div>

            <div style={{display: "flex", flexDirection: "column", marginTop: 8}}>
                {topics.map((topic) => (
                    <NavLink
                        key={topic.topicID}
                        style={({ isActive }) => ({
                            fontWeight: 500,
                            padding: "4px 8px",
                            borderRadius: 4,
                            backgroundColor: isActive ? '#E2E6F3' : 'transparent',
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        })}
                        className={({isActive}) => isActive ? "active-card-bot-nav": ""}
                        to={`/card-bot/${topic.topicID}`}> 
                        {topic.topicName}
                    </NavLink>
                ))}
            </div>
        </div>
    )
}

export default CardBotNav;