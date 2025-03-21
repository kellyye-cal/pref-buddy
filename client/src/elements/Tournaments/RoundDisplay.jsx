import React, {useState, useEffect} from "react";
import RoundType from "./RoundType";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {faArrowUp, faArrowDown} from '@fortawesome/free-solid-svg-icons'

function RoundDisplay({rounds, displayTournament, displayJudge, publicView, judgeLink, groupElims}) {

  const groupRounds = (rounds) => {
    const grouped = {};

    rounds.forEach((round) => {
        const key = `${round.aff}-${round.neg}-${round.number}`;

        if (!grouped[key]) {
            grouped[key] = {
                aff: round.aff,
                neg: round.neg,
                number: round.number,
                judges: [],
                votes: { aff: 0, neg: 0 },
                decision: round.elim_decision || round.decision,
                round_type: "",
                tournament_id: round.tournament_id,
            };
        }

        grouped[key].judges.push([round.judge_name, round.judge_id]);

        if (round.decision.toLowerCase() === "aff") {
            grouped[key].votes.aff += 1;
        } else if (round.decision.toLowerCase() === "neg") {
            grouped[key].votes.neg += 1;
        }

        if (grouped[key].votes.aff > grouped[key].votes.neg) {
          grouped[key].decision = "Aff"
        } else {
          grouped[key].decision = "Neg"
        }

        if (round.round_type) {
          grouped[key].round_type = round.round_type;
        }

    });
    return Object.values(grouped);
  };

  const [groupedRounds, setGroupedRounds] = useState([]);

  useEffect(() => {
    if (rounds.length > 0) {
      setGroupedRounds(groupElims ? groupRounds(rounds) : rounds);
    }
  }, [rounds, groupElims]);

  const [sortCategories, setSortCategories] = useState({
    Aff: 0,
    Neg: 0,
    Judge: 0,
    Vote: 0,
    Type: 0
  });

  const sort = (category) => {
    setSortCategories(prev => {
      const updatedCategories = Object.keys(prev).reduce((acc, key) => {
        if (key === category) {
          acc[key] = prev[key] === 0 ? 1 : prev[key] * -1;
        } else {
          acc[key] = 0;
        }
        return acc;
      }, {});
  
      return updatedCategories;
    });
  
    const newSortValue = sortCategories[category] === 0 ? 1 : sortCategories[category] * -1;
  
    const sortedRounds = [...groupedRounds].sort((a, b) => {
      const compareValue = category === 'Aff' ? a.aff.localeCompare(b.aff) :
                           category === 'Neg' ? a.neg.localeCompare(b.neg) :
                           category === 'Judge' ? a.judges[0][0].localeCompare(b.judges[0][0]) :
                           category === 'Vote' ? a.decision.localeCompare(b.decision) :
                           category === 'Type' ? a.round_type.localeCompare(b.round_type) :
                           0;
  
      return compareValue * newSortValue;
    });
  
    setGroupedRounds(sortedRounds);
  }

  return (
      <table className="table round-history">
        <thead>
          <tr>
              {displayTournament ? <th>Tournament</th> : <></>}
              <th>R#</th>
              <th>
                <button className="link" onClick={() => sort("Aff")}>
                  Aff
                  <span style={{marginLeft: 4}}>
                    {sortCategories.Aff === 1 ?
                      <FontAwesomeIcon icon={faArrowDown} size="xs"/>
                    : sortCategories.Aff === -1 ? <FontAwesomeIcon icon={faArrowUp} size="xs"/>
                    : <></>}
                  </span>
                </button>
              </th>
              <th>
                <button className="link" onClick={() => sort("Neg")}>
                  Neg
                  <span style={{marginLeft: 4}}>
                    {sortCategories.Neg === 1 ?
                      <FontAwesomeIcon icon={faArrowDown} size="xs"/>
                    : sortCategories.Neg === -1 ? <FontAwesomeIcon icon={faArrowUp} size="xs"/>
                    : <></>}
                  </span>
                </button>
              </th>
              {displayJudge ?
                <th>
                  <button className="link" onClick={() => sort("Judge")}>
                  Judge
                  <span style={{marginLeft: 4}}>
                    {sortCategories.Judge === 1 ?
                      <FontAwesomeIcon icon={faArrowDown} size="xs"/>
                    : sortCategories.Judge === -1 ? <FontAwesomeIcon icon={faArrowUp} size="xs"/>
                    : <></>}
                  </span>
                </button>
                </th> 
                  : 
                <></>}
              <th>
                <button className="link" onClick={() => sort("Vote")}>
                  Vote
                  <span style={{marginLeft: 4}}>
                    {sortCategories.Vote === 1 ?
                      <FontAwesomeIcon icon={faArrowDown} size="xs"/>
                    : sortCategories.Vote === -1 ? <FontAwesomeIcon icon={faArrowUp} size="xs"/>
                    : <></>}
                  </span>
                </button>
              </th>

              {groupElims ? <> </> : <th>Panel</th>}

              <th>
                <button className="link" onClick={() => sort("Type")}>
                  Type
                  <span style={{marginLeft: 4}}>
                    {sortCategories.Type === 1 ?
                      <FontAwesomeIcon icon={faArrowDown} size="xs"/>
                    : sortCategories.Type === -1 ? <FontAwesomeIcon icon={faArrowUp} size="xs"/>
                    : <></>}
                  </span>
                </button>
              </th>

          </tr>
        </thead>
        <tbody>
          {groupedRounds.map((round, index) => (
            <tr key={index} className="round">
                {displayTournament ? 
                  <td className="hover-link">
                    <NavLink target="_blank" rel="noopener noreferrer"
                      to={publicView ? `/public/tournaments/${round.tournament_id}` : `/tournaments/${round.tournament_id}`}>
                        {round.name}
                    </NavLink>
                    </td>
                : <> </>}
                <td> {round.number}</td>
                <td> {round.decision === "Aff" ? <b> {round.aff} </b> : <span> {round.aff} </span>}</td>
                <td> {round.decision === "Neg" ? <b> {round.neg} </b> : <span> {round.neg} </span> } </td>
                {displayJudge ? 
                  <td>
                    {round.judges.map((judge, judge_index) =>
                      <span key={judge_index}>
                        <NavLink target="_blank" and rel="noopener noreferrer" className="hover-link" to={`${judgeLink}/${judge[1]}`}> {judge[0]} </NavLink>
                        {judge_index < round.judges.length - 1 && ", "}
                      </span>
                    )}
          
                  </td> 
                  :
                  <></>}
                  {groupElims ? (round.judges.length > 1 ?
                    (round.votes.aff > round.votes.neg ?
                      <td> {round.votes.aff}-{round.votes.neg} Aff </td>
                      :
                      <td> {round.votes.neg}-{round.votes.aff} Neg </td>
                    )
                    :
                    (round.votes.aff > round.votes.neg ?
                      <td> Aff </td>
                      :
                      <td> Neg </td>
                    )
                  ) : (<td> {round.decision} </td>)}
                {groupElims ? <></> : round.elim_decision ? <td> {round.elim_decision} </td> : <td> -- </td>}
                {publicView ?
                  <td style={{width: 155}}>
                    <div  className={`pill ${round.round_type === "Policy v. Policy" ? "pvp" 
                        : round.round_type === "Policy v. K" ? "pvk"
                        : round.round_type === "K v. Policy" ? "kvp"
                        : round.round_type === "K v. K" ? "kvk"
                        : round.round_type === "T/Theory" ? "theory"
                        : "unselected"}`}
                        style={{maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
                            {round.round_type ? round.round_type : "Unspecified"}
                    </div>
                  </td> :
                  <td style={{width: 155}}> <RoundType type={round.round_type} t_id={round.tournament_id} round={round.number} j_id={round.judge_id}/> </td>
                }
            </tr>
          ))}
        </tbody>
      </table>
  )
}

export default RoundDisplay;