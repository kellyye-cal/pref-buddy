import React, {useState } from 'react';
import '../App.css';

var filteredRecords;

function handleSearchChange(event, [search, setSearch], data, keys, updateFilteredRecords) {
    const searchTerm = event.target.value.toLowerCase()

    filteredRecords = data.filter((record) => {
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