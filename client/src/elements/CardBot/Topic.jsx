import React, {useEffect, useState} from "react";
import cardbotClient from "../../api/cardbotClient";
import { useParams } from "react-router-dom";
import NavBar from "../NavBar";
import CardBotNav from "./CardBotNav";
import CardPreview from "./CardPreview";
import Card from './Card'
import Spinner from "../Spinner";

function Topic() {
    const {topicID} = useParams();
    const [topicInfo, setTopicInfo] = useState({});
    const [cards, setCards] = useState([]);

    const [selected, setSelected] = useState({});

    useEffect(() => {
        cardbotClient.get(`/api/topics/${topicID}`).then((res) => {
            setTopicInfo(res.data)
        }).catch((err) => console.error(err))

        // cardbotClient.post(`/api/topics/scrape`, {topicID}).then((res) => {
        //     console.log(res.data)
        // }).catch((err) => console.error(err))

        cardbotClient.get(`/api/cards/${topicID}`).then((res) => {
            setCards(res.data);
            setSelected(res.data[0].cardID);
        }).catch((err) => console.error(err))
    }, [topicID])

    return (
        <div className="page">
            <NavBar />
            <div className="cardbot-page">
                <CardBotNav />

                <div className="cardbot-content">
                    <div>
                        <h1> {topicInfo.topicName} </h1>
                        <p> {topicInfo.description} </p>
                    </div>

                    {cards.length > 0 ?
                        <div style={{flex: 1, display: "flex", gap: 12, overflow: "hidden"}}>
                            <div style={{
                                width: "260px",
                                minWidth: "260px",
                                maxWidth: "260px",
                                overflowY: "auto",
                                // flexShrink: 0,
                            }}>
                                {cards && (cards.map((card) => (
                                    <CardPreview 
                                        key={card.cardID}
                                        card={card}
                                        setSelected={setSelected}
                                        selected={card.cardID === selected}/>
                                )))}
                            </div>

                            <Card cardID={selected}/>
                        </div>
                    :
                        <div style={{
                                marginLeft: "auto",
                                marginRight: "auto",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                width: "400px"}}>
                            <h3> Scraping Updates </h3>
                            <Spinner />
                        </div>
                    }

                </div>
            </div>

        </div>
    )
}

export default Topic;