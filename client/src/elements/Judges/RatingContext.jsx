import React, { createContext, useState, useEffect } from 'react';
import axios from '../../api/axios';

export const RatingContext = createContext();

export function RatingProvider({ children }) {
    const [ratings, setRatings] = useState({});

    // Fetch all ratings initially
    useEffect(() => {
        axios
            .get('/api/ratings')
            .then((res) => {
                const ratingsMap = res.data.reduce((acc, rating) => {
                    const key = `${rating.u_id}-${rating.j_id}`;
                    acc[key] = rating.rating;
                    return acc;
                }, {});
                setRatings(ratingsMap);
                console.log(ratingsMap)
            })
            .catch((err) => console.error('Error fetching ratings:', err));
    }, []);


    // Function to update a rating
    const updateRating = (userID, judgeID, newRating) => {
        axios
            .post('/api/set_rating/', {
                u_id: userID,
                j_id: judgeID,
                rating: newRating,
            })
            .then(() => {
                const key = `${userID}-${judgeID}`;
                setRatings((prev) => ({ ...prev, [key]: newRating }));
            })
            .catch((err) => console.error('Error updating rating:', err));
    };

    return (
        <RatingContext.Provider value={{ ratings, updateRating }}>
            {children}
        </RatingContext.Provider>
    );
}