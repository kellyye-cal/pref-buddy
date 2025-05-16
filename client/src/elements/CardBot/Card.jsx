import React, {useState, useEffect} from "react";
import {formatDateLong, parseCite, parseSource} from "../Utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faNewspaper,  faCircleUser, faLink, faCopy} from "@fortawesome/free-solid-svg-icons";

import Spinner from "../Spinner";
import cardbotClient from "../../api/cardbotClient";

function Card({cardID}) {
    const [card, setCard] = useState({});
    const [formattedText, setFormattedText] = useState("");
    const [cite, setCite] = useState("");
    const [source, setSource] = useState("");


    useEffect(() => {
        const fetchText = () => {
            cardbotClient.post('/api/cards/fetch-underline',
                {cardID}
            ).then((res) => {
                setFormattedText(res.data);
            }).catch((err) => console.error(err))
        }

        cardbotClient.post('/api/cards/get-card', {cardID}).then((res) => {
            setCard(res.data);
            setFormattedText(res.data.underlined);
            setCite(parseCite(res.data.source, res.data.publisher, res.data.datePublished));
            setSource(parseSource(res.data))

            if (!res.data.underlined) {
                fetchText();
            }
        }).catch((err) => console.error(err));
    }, [cardID])

    const copyCard = async() => {
        const toCopy = `
            <div style="font-family: Calibri, sans-serif; font-size: 13pt;">
                <b>${cite}</b> ${source}
            </div>
            <div style="font-family: Calibri, sans-serif; font-size: 11pt;">
                ${formattedText}
            </div>
            `;
        try {
            const type = "text/html";
            const blob = new Blob([toCopy], {type});
            const data = [new ClipboardItem({[type]: blob})];

            await navigator.clipboard.write(data);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    }

    if (card) {
        return (
            <div className="debate-card">
                <div className="title"> {card.title} </div>
                <div className="source">
                    <span>
                        <FontAwesomeIcon icon={faCalendar} size="sm" style={{marginRight: 4}}/>
                        {formatDateLong(card.datePublished)}
                    </span>
    
                    <span> | </span>
    
                    <span>
                        <FontAwesomeIcon icon={faNewspaper} size="sm" style={{marginRight: 4}}/>
                        {card.publisher}
                    </span>
                    
                    <span> | </span>
    
                    <span>
                        <FontAwesomeIcon icon={faCircleUser} size="sm" style={{marginRight: 4}}/>
                        {(card?.source?.length > 0) ? card.source : card.publisher}
                    </span>
    
                    <span>
                        <FontAwesomeIcon icon={faLink} size="sm" style={{marginRight: 4}}/>
                        {card.url}
                    </span>
                </div>
    
                <div>
                    <div className="h-between" style={{color: "var(--text-gray"}}>
                        <div style={{fontSize: "14pt", fontWeight: 600}}> 
                            TagBot Cut
                        </div>

                        {formattedText ? 
                            <button
                                style={{color: "var(--text-gray"}}
                                onClick={copyCard}>
                                <FontAwesomeIcon icon={faCopy} />
                            </button>
                            :
                            <></>
                        }
                    </div>
    
                    <div className="card-content">
                        <div className="tag"> Inflation </div>
                        <div className="cite">
                            <span style={{fontWeight: "bold"}}> {cite} </span>
                            <span> {source} </span>
                        </div>
    
                        {formattedText ? 
                            <div dangerouslySetInnerHTML={{ __html: formattedText }}>
                            </div>
                            :
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                marginTop: 40
                            }}>
                                <h3> Cutting Card</h3>
                                <Spinner />
                            </div>
                            }
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div>

            </div>
        )
    }
    
}

export default Card;