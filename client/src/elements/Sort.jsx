import React, { useState, useRef} from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faChevronDown, faArrowUp, faArrowDown} from '@fortawesome/free-solid-svg-icons'
import Dropdown from './Dropdown';

function Sort({category, setCategory, asc, setAsc}) {
    const [isOpen, setIsOpen] = useState(false)
    const buttonRef = useRef(null)

    const reverseSort = () => {setAsc(!asc)}
    const reverseOpen = () => {setIsOpen(!isOpen)}
    const closeDropdown = () => {setIsOpen(false)}

    const setCategoryRating = () => {
        setCategory("Rating");
        closeDropdown()
    }

    const setCategoryName = () => {
        setCategory("Name");
        closeDropdown();
    }

    return (
        <div style={{display: "flex", gap: 4, alignItems: "center", margin: "4px 0"}}>
            <div className="sort-filter-option"> Sort: </div>
            <button onClick={reverseSort} className="sort direction"> {asc ? <FontAwesomeIcon icon={faArrowUp} /> : <FontAwesomeIcon icon={faArrowDown}/>} </button>

            <div style={{display: "inline-block", position: "relative"}}>
                <button ref={buttonRef} onClick={reverseOpen} className="sort pill">
                    {category} <FontAwesomeIcon size="xs" icon={faChevronDown} style={{marginLeft: 4}}/>
                </button>

                <Dropdown isOpen={isOpen} closeFunc={closeDropdown} buttonRef={buttonRef}>
                    <h5> Sort By</h5>

                    <button 
                        className={`dropdown-item ${category === "Rating" ? "selected" : ""}`}
                        onClick={setCategoryRating}> Rating </button>
                    <button className={`dropdown-item ${category === "Name" ? "selected" : ""}`}
                        onClick={setCategoryName}> Name </button>
                </Dropdown>
            </div>
        </div>
    )
}

export default Sort;