import React, { useEffect, useState } from 'react';
import {Link, useParams} from "react-router-dom";
import axios from 'axios'
import '../App.css';

const leftSelected = true;

function Toggle({leftText, rightText}) {
    return (
        <div>
            <button> {leftText} </button>
            <button> {rightText} </button>
        </div>
    )
};

export default Toggle;