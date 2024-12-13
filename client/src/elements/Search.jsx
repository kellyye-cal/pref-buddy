import React, { useEffect, useState } from 'react';
import {Link, useParams} from "react-router-dom";
import axios from 'axios'
import '../App.css';

var filteredRecords;

function handleSearchChange(event, [search, setSearch], data, keys, updateFilteredRecords) {
    const searchTerm = event.target.value.toLowerCase()
    setSearch(searchTerm)

    filteredRecords = data.filter((record) => {
        console.log(searchTerm)


        var contains = false;

        if (searchTerm === '') {
            contains = true
        }

        keys.forEach((key) => {
            contains = contains || record[key].toLowerCase().includes(searchTerm)
        })

        return contains;
    })

    updateFilteredRecords(filteredRecords);
}

function Search({data, keys, onFilteredRecordChange}) {
    const [search, setSearch] = useState('');

    return (
        <>
            <input
                type='text'
                className='search-bar'
                placeholder='Search...'
                value={search}
                onChange={(e) => handleSearchChange(e, [search, setSearch], data, keys, onFilteredRecordChange)}
            />
        </>
    )
}

export default Search;