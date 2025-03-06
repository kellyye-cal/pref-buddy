import React, {useState, useRef} from "react";
import Dropdown from "./Dropdown";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function Filter({categoryName, children, resetFunc, display}) {
    const [isOpen, setIsOpen] = useState(false)
    const buttonRef = useRef(null)

    const reverseOpen = () => {setIsOpen(!isOpen)}
    const closeDropdown = () => {setIsOpen(false)}

    const reset = () => {
        resetFunc();
        closeDropdown();
    }

    return (
        <div>
            <div style={{display: "inline-flex", position: "relative", alignItems: "center", gap: 8}}>
                <button className={`filter pill ${display ? "selected" : ""}`}
                        ref={buttonRef} onClick={reverseOpen}>
                            <FontAwesomeIcon
                                icon={faPlus}
                                style={{border: "1.5px solid #6a6a6a", padding: 2, height: 10, width: 10, borderRadius: 40, fontSize: 11}}
                                className={`${isOpen || display ? "hidden" : ""}`}/>
                            {categoryName}
                            <span className={`${!display ? "hidden" : ""}`}> | </span>
                            <span className="filter-display"> {display} </span>
                </button>

                <Dropdown isOpen={isOpen} closeFunc={closeDropdown} buttonRef={buttonRef}>
                        <h5> Filter By</h5>
                        {children}

                        <button style={{marginLeft: "auto", marginRight: "auto"}} onClick={reset} className="reset-filters"> Clear All </button>
                </Dropdown>
            </div>
        </div>
    )
}

export default Filter;