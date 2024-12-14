import React, { useEffect, useState } from 'react';
import {Link, useParams} from "react-router-dom";
import '../App.css';

const styles = {
    ringContainer: {
        width: 80,
        height: 80
    }, text: {
        position: 'absolute',
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        fontWeight: 600,
        fontSize: 16
    }
    
}

function ProgressRing({progress, full}) {
    const radius = 32;
    const strokeWidth = 16;
    const circumference = 2 * Math.PI * radius;

    const offset = circumference - (progress / full) * circumference

    var color = "#e6e6e6"

    if (progress/full < 0.5 && progress/full > 0) {
        color = "#FF3737"
    } else if (progress/full < 1) {
        color = "#FFD900"
    } else {
        color = "#19BB5A"
    }

    return (
        <div style={{position: "relative", display: "inline-block"}}>
            <svg style={styles.ringContainer}>
                <circle
                    stroke="#e6e6e6"
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    r={radius}
                    cx="40"
                    cy="40"
                />

                <circle
                    stroke={color}
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    r={radius}
                    cx="40"
                    cy="40"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                />

            </svg>

            <p style={styles.text}> {progress}/{full}</p>
        </div>
    )
}

export default ProgressRing;