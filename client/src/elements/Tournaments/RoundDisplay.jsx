import React from "react";
import RoundType from "./RoundType";

function RoundDisplay({rounds, displayTournament}) {
    return (
        <table className="table round-history">
          <thead>
            <tr>
                {displayTournament ? <th>Tournament</th> : <></>}
                <th>R#</th>
                <th>Aff</th>
                <th>Neg</th>
                <th> Vote </th>
                <th>Panel</th>
                <th>Type</th>

            </tr>
          </thead>
          <tbody>
            {rounds.map((round, index) => (
                <tr key={index} className="round">
                    {displayTournament ? <td> {round.name}</td> : <> </>}
                    <td> {round.number}</td>
                    <td> {round.aff}</td>
                    <td> {round.neg}</td>
                    <td> {round.decision}</td>
                    <td style={{maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}> {round.elim_decision ? round.elim_decision : "--"}</td>
                    <td style={{width: 155}}> <RoundType t_id={round.tournament_id} round={round.number} j_id={round.judge_id} type={round.round_type}/> </td>
                </tr>
            ))}
          </tbody>
        </table>
    )
}

export default RoundDisplay;