import React from 'react';
import { NavLink } from 'react-router-dom';
import TournPreview from './TournPreview';

function TournList({data}) {
      return (
        <table className="table">
          <thead>
            <tr>
              <th>Tournament</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((tournament, index) => (
              <TournPreview key={index} tournament={tournament}/>
            ))}
          </tbody>
        </table>
      );
}

export default TournList;
