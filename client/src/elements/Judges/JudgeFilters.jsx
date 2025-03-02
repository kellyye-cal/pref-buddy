import React, {useState, useRef, useEffect} from "react";
import Filter from "../Filter";

function JudgeFilters({filteredJudges, setFilteredJudges, allJudges}) {
    const [ratingDisplay, setRatingDisplay] = useState("")
    const [ratingFilters, setRatingFilters] = useState({
        Unrated: false,
        Rated: false,
        Rated1: false,
        Rated2: false,
        Rated3: false,
        Rated4: false,
        Rated5: false,
        Strike: false,
    });

    const updateRatingFilters = (event) => {
        const {id, checked} = event.target;
        setRatingFilters(prev => ({...prev, [id]: checked}))
    }

    const filterRated = (judge) => {
        return (judge.rating && judge.rating > 0)
    }

    useEffect(() => {
        const displayFormat = (key) => key.replace(/([A-Z0-9])/g, " $1").trim();

        const selectedFilters = Object.keys(ratingFilters).filter(key => ratingFilters[key]).map(displayFormat);
        setRatingDisplay(selectedFilters.join(", "));

        setFilteredJudges(allJudges);


        for (let i = 0; i < Object.keys(ratingFilters).length; i++) {
            let id = Object.keys(ratingFilters)[i];
            if (id === "Unrated" && ratingFilters[id]) {
                const filtered = filteredJudges.filter(judge => !judge.rating || judge.rating === 0)
                setFilteredJudges(filtered)
            }
            
            if (id === "Rated" && ratingFilters[id]) {
                const filtered = filteredJudges.filter(judge => judge.rating && judge.rating > 0);
                setFilteredJudges(filtered)
            }
        }

    }, [ratingFilters]);

    const resetRatingFilters = () => {
        setRatingFilters({
            Unrated: false,
            Rated: false,
            Rated1: false,
            Rated2: false,
            Rated3: false,
            Rated4: false,
            Rated5: false,
            Strike: false
        })

        setRatingDisplay("");
    }

    return (
        <div>
            <Filter categoryName={"Rating"} resetFunc={resetRatingFilters} applyFunc={updateRatingFilters} display={ratingDisplay}>
                <div className="dropdown-filter">
                    {Object.keys(ratingFilters).map((key) => (
                        <label key={key} htmlFor={key}>
                            <input
                                type="checkbox"
                                id={key}
                                checked={ratingFilters[key]}
                                onChange={updateRatingFilters}
                            />
                            {key.replace(/([0-9])/g, " $1").trim()}
                        </label>
                    ))}
                </div>
            </Filter>
        </div>
    )
}

export default JudgeFilters;