import React from 'react';
import '../../App.css';


function Rating({rating}) {
    
    var display = String(rating);

    if (rating === 0 || !rating) {
        display = "-";
    } else if (rating === 6) {
        display = "S";
    }

    return (
        <div className={
            display === "1" ? "rating oneRate" :
            display === "2" ? "rating twoRate" :
            display === "3" ? "rating threeRate" :
            display === "4" ? "rating fourRate" :
            display === "5" ? "rating fiveRate" :
            display === "S" ? "rating strikeRate" :
            "rating noRate"
        }>
            {display}
        </div>
    )
}

export default Rating;