import React, {useState, useRef, useEffect} from "react";
import Filter from "../Filter";

function JudgeFilters({setFilteredJudges, allJudges}) {
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

    const [paradigmDisplay, setParadigmDisplay] = useState("")
    const [paradigmFilters, setParadigmFilters] = useState({
        HasParadigm: false,
        NoParadigm: false
    });

    const updateRatingFilters = (event) => {
        const {id, checked} = event.target;
        setRatingFilters(prev => ({...prev, [id]: checked}))
    }

    const filterRated = (judge) => {return (judge.rating && judge.rating > 0)};
    const filterUnrated = (judge) => {return (!judge.rating || judge.rating === 0)};
    const filterOnes = (judge) => {return (judge.rating && judge.rating === 1)}
    const filterTwos = (judge) => {return (judge.rating && judge.rating === 2)}
    const filterThrees = (judge) => {return (judge.rating && judge.rating === 3)}
    const filterFours = (judge) => {return (judge.rating && judge.rating === 4)}
    const filterFives = (judge) => {return (judge.rating && judge.rating === 5)}
    const filterStrikes = (judge) => {return (judge.rating && judge.rating === 6)}


    useEffect(() => {
        const displayFormat = (key) => key.replace(/([A-Z0-9])/g, " $1").trim();

        const selectedFilters = Object.keys(ratingFilters).filter(key => ratingFilters[key]).map(displayFormat);
        setRatingDisplay(selectedFilters.join(", "));

        if (selectedFilters.length === 0) {
            setFilteredJudges(allJudges);
            return
        }

        let filteredSet = new Set();

        Object.keys(ratingFilters).forEach((key) => {
            if (ratingFilters[key]) {
                let filtered;
                switch (key) {
                    case "Unrated":
                        filtered = allJudges.filter(filterUnrated);
                        break;
                    case "Rated":
                        filtered = allJudges.filter(filterRated);
                        break;
                    case "Rated1":
                        filtered = allJudges.filter(filterOnes);
                        break;
                    case "Rated2":
                        filtered = allJudges.filter(filterTwos);
                        break;
                    case "Rated3":
                        filtered = allJudges.filter(filterThrees);
                        break;
                    case "Rated4":
                        filtered = allJudges.filter(filterFours);
                        break;
                    case "Rated5":
                        filtered = allJudges.filter(filterFives);
                        break;
                    case "Strike":
                        filtered = allJudges.filter(filterStrikes);
                        break;
                    default:
                        return;
                }
                filtered.forEach(judge => filteredSet.add(judge));
            }
        })

        const finalFiltered = Array.from(filteredSet)
        setFilteredJudges(finalFiltered)

    }, [ratingFilters, allJudges]);

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

    const updateParadigmFilters = (event) => {
        const {id, checked} = event.target;
        setParadigmFilters(prev => ({...prev, [id]: checked}))
    }

    const filterParadigm = (judge) => {return judge.paradigm}

    useEffect(() => {
        const displayFormat = (key) => key.replace(/([A-Z0-9])/g, " $1").trim();

        const selectedFilters = Object.keys(paradigmFilters).filter(key => paradigmFilters[key]).map(displayFormat);
        setParadigmDisplay(selectedFilters.join(", "));

        if (selectedFilters.length === 0) {
            setFilteredJudges(allJudges);
            return
        }

        let filteredSet = new Set();

        Object.keys(paradigmFilters).forEach((key) => {
            if (paradigmFilters[key]) {
                let filtered;
                switch (key) {
                    case "HasParadigm":
                        filtered = allJudges.filter(filterParadigm);
                        break;
                    case "NoParadigm":
                        filtered = allJudges.filter(judge => !filterParadigm(judge));
                        break;
                    default:
                        return;
                }
                filtered.forEach(judge => filteredSet.add(judge));
            }
        })

        const finalFiltered = Array.from(filteredSet)
        setFilteredJudges(finalFiltered)

    }, [paradigmFilters, allJudges]);

    const resetParadigmFilters = () => {
        setParadigmFilters({
            HasParadigm: false,
            NoParadigm: false
        })

        setParadigmDisplay("");
    }

    return (
        <div style={{display: "flex", alignItems: "center", gap: 8}}>
            <div className="sort-filter-option" style={{marginLeft: 6}}> Filter:  </div>

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

            <Filter categoryName={"Paradigm"} resetFunc={resetParadigmFilters} applyFunc={updateParadigmFilters} display={paradigmDisplay}>
                <div className="dropdown-filter">
                    {Object.keys(paradigmFilters).map((key) => (
                        <label key={key} htmlFor={key}>
                            <input
                                type="checkbox"
                                id={key}
                                checked={paradigmFilters[key]}
                                onChange={updateParadigmFilters}
                            />
                            {key.replace(/([A-Z])/g, " $1").trim()}
                        </label>
                    ))}
                </div>
            </Filter>
        </div>
    )
}

export default JudgeFilters;