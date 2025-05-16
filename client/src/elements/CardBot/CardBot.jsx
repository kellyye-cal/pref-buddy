import React, {useState, useEffect, useContext} from "react";
import NavBar from "../NavBar";
import CardBotNav from "./CardBotNav";

import cardbotClient from "../../api/cardbotClient";
import AuthContext from "../../context/AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function CardBot() {
    const {auth} = useContext(AuthContext);
    const [allTopics, setAllTopics] = useState([]);
    const [followingTopics, setFollowingTopics] = useState([]);

    useEffect(() => {
        cardbotClient.get(`/api/topics/all/${auth.userId}`).then((res) => {
            setAllTopics(res.data.topics)
            setFollowingTopics(res.data.myTopics)
        }).catch((err) => {console.error(err)})
    }, [])

    const followTopic = (topicID) => {
        cardbotClient.post(`/api/follow-topic`,
            {userID: auth.userId, topicID}
        ).then((res) => {
            setFollowingTopics(res.data);
        }).catch((err) => {console.error(err)})
    }

    return (
        <div className="page">
            <NavBar />
            <div className="cardbot-page">
                <CardBotNav />
                <div className="cardbot-content">
                    <h1> CardBot </h1>

                    <div>
                        <h2>
                            Following
                        </h2>

                        <div className="topic-card-container">
                            {allTopics.map((topic) => (
                                (followingTopics.includes(topic.topicID)) ?
                                (<button 
                                    className="topic-card"
                                    onClick={() => {followTopic(topic.topicID)}}>
                                    <p>{topic.topicName} </p>
                                    <button> <FontAwesomeIcon icon={faPlus}/> </button>
                                </button>) : null
                                
                            ))}
                        </div>
                    </div>

                    <div style={{marginTop: 20}}>
                        <h2> All Topics </h2>
                        <div className="topic-card-container">
                            {allTopics.map((topic) => (
                                !(followingTopics.includes(topic.topicID)) ?
                                (<button 
                                    className="topic-card"
                                    onClick={() => {followTopic(topic.topicID)}}>
                                    <p>{topic.topicName} </p>
                                    <button> <FontAwesomeIcon icon={faPlus}/> </button>
                                </button>) : null
                                
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardBot;