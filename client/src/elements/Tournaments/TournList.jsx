import React from 'react';
import { NavLink } from 'react-router-dom';

function TournList({data}) {
    // const startDate = new Date(data.start_date)
    // const endDate = new Date(data.end_date)

      return (
        <table className="table">
          <thead>
            <tr>
              <th>Tournament</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((tournament, index) => (
              <tr key={index}>
                <td className="tourn-link"> <NavLink to={`/tournaments/${tournament.t_id}`} key={tournament.id}> {tournament.name} </NavLink></td>
                <td>{new Date(tournament.start_date).getMonth() + 1}/{new Date(tournament.start_date).getDate()}/{new Date(tournament.start_date).getFullYear().toString().slice(-2)} - {new Date(tournament.end_date).getMonth() + 1}/{new Date(tournament.end_date).getDate()}/{new Date(tournament.end_date).getFullYear().toString().slice(-2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
}

export default TournList;
