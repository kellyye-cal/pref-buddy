import React from 'react';
import { NavLink } from 'react-router-dom';
import TournPreview from './TournPreview';

function TournList({data, sortOrder}) {
      const sortedData = [...data].sort((a, b) => {
        if (sortOrder === 'asc') {
          return new Date(a.end_date) - new Date(b.end_date)
        } else if (sortOrder === 'dsc') {
          return new Date(b.end_date) - new Date(a.end_date)
        }
        return 0;
      });

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
            {sortedData.map((tournament, index) => (
              <TournPreview key={index} tournament={tournament}/>
            ))}
          </tbody>
        </table>
      );
}

export default TournList;
