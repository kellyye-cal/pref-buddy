import React from "react";
import {formatDateSlash} from '../Utils'

function CardPreview({card, setSelected, selected}) {
    return (
        <div className="card-preview"
            onClick={() => setSelected(card.cardID)}
            style={{
                border: `${selected ? "1.5px var(--blue) solid" : ""}`,
            }}
        >
            <p className="title"> {card.title} </p>
            <div className="cite">
                <span> {formatDateSlash(card.datePublished)} </span>
                <span> | </span>
                <span> {card.source.name} </span>
            </div>

            <div className="body">
                {card.body}
            </div>
        </div>
    )
};

export default CardPreview;