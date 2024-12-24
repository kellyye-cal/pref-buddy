// import dependencies 
const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
const path = require('path')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const verifyJWT = require('../middleware/verifyJWT')
const cookieParser = require('cookie-parser')
const { verify } = require('crypto')
require('dotenv').config({path: '../.env'});

const authRoutes = require('./routes/authRoutes')

// create instance of express application, backbone of the server
const app = express()

// set up middleware functions to serve static files, handles client-side assets like CSS and JS
app.use(express.static(path.join(__dirname, "public")))

//middleware for cookies
app.use(cookieParser());

// Cross-Origin Resource Sharing to manage and control web security
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Cookie']
}))

// Parse JSON data from HTTP requests to process data sent from the client
app.use(express.json())

// Configure the application port to specify where server listens for incoming requests
const port = 4000

// Establish connection to MySQL database to ensure it interacts effectively
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: '',
    database: "pref-buddy",
    port: 3306
})

app.use('/api/auth', authRoutes)


app.get('/api/judge/:id', verifyJWT, (req, res) => {
    const j_id = req.params.id;
    const u_id = req.query.u_id;


    const sql = "SELECT *,  (year(curdate()) - start_year) AS yrs_dbt, (year(curdate()) - judge_start_year) AS yrs_judge FROM users AS u JOIN (SELECT * FROM judge_info WHERE `id` = ?) AS j on u.id = j.id LEFT JOIN ranks on ranks.judge_id = j.id AND `ranker_id` = ?";
    db.query(sql, [j_id, u_id], (err, result) => {
        if (err) {
            console.error('Database error: ', err);
            return res.status(500).json({error: 'Failed to fetch data'});
        }
        return res.json(result);
    });
});

app.get('/api/alljudges', verifyJWT, (req, res) => {
    const u_id = req.query.u_id;
    const cookies = req.cookies;

    const sql = "SELECT * FROM users as u LEFT JOIN (SELECT * FROM ranks WHERE `ranker_id` = ?) AS r ON u.id = r.judge_id WHERE u.judge = 1 ORDER BY r.rating ASC"
   
    db.query(sql, [u_id], (err, result) => {
        if (err) {
            console.error('Database error: ', err);
            return res.status(500).json({error: 'Failed to fetch data'});
        }
        
        return res.json(result);
    })
})

app.post('/api/set_rating/', verifyJWT, (req, res) => {
    const {u_id, j_id, rating} = req.body;

    // const sql = "UPDATE ranks SET `rating` = ? WHERE `ranker_id` = ? AND `judge_id` = ?"
    const sql = "INSERT INTO ranks (judge_id, ranker_id, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating = VALUES(rating)"
    db.query(sql, [j_id, u_id, rating], (err, result) => {
        if (err) {
            return res.status(500).json({error: 'Failed to fetch data'});
        }
        return res.status(200).json({success: true, result})
    })
})

app.get('/api/tournaments/', verifyJWT, (req, res) => {
    const u_id = req.id

    const sql = "SELECT * FROM attending AS a INNER JOIN tournaments AS t ON a.tournament_id = t.id WHERE `user_id` = ?"
    db.query(sql, [u_id], (err, result) => {
        if (err) {
            return res.status(500).json({error: 'Failed to fetch data from tournaments table'});
        }
        return res.json(result)
    })
})

app.get('/api/alltournaments', verifyJWT, (req, res) => {
    const u_id = req.id

    const sql = "SELECT tournaments.id AS t_id, tournaments.link, tournaments.name, tournaments.name, tournaments.start_date, tournaments.end_date, CASE WHEN a.user_id IS NOT NULL THEN 1 ELSE 0 END AS attending, CASE WHEN j.user_id IS NOT NULL THEN 1 ELSE 0 END AS judging FROM tournaments LEFT JOIN (SELECT * FROM attending WHERE user_id = 1) AS a on a.tournament_id = tournaments.id LEFT JOIN (SELECT * FROM judging_at WHERE user_id = 1) AS j on j.tournament_id = tournaments.id"    
    db.query(sql, [u_id], (err, result) => {
        if (err) return res.status(500).json({error: "Failed to fetch tournament data."})
        return res.json(result)
    })
})

app.get('/api/tournaments/:id', verifyJWT, async (req, res) => {
    const t_id = req.params.id;
    const u_id = req.id

    try {
        var numRated;
        var numJudges;

        const numRatedQuery = "SELECT COUNT(*) FROM judging_at INNER JOIN ranks on judging_at.user_id = ranks.judge_id WHERE `tournament_id` = ? AND `ranker_id` = ? AND `rating` IS NOT NULL AND `rating` > 0"
        const [ratedResult] = await db.promise().query(numRatedQuery, [t_id, u_id]);


        const numJudgesQuery = "SELECT COUNT(*) from judging_at WHERE `tournament_id` = ?"
        const [judgesResult] = await db.promise().query(numJudgesQuery, [t_id]);

        return res.json([ratedResult[0]['COUNT(*)'], judgesResult[0]['COUNT(*)']])
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch data from tournaments table' });
    }
})

app.get('/api/tournaments/:id/judges', verifyJWT, (req, res) => {
    const t_id = req.params.id
    const u_id = req.query.u_id;

    const sql = "SELECT ja.user_id AS j_id, u.name, u.affiliation, ji.paradigm, (year(curdate()) - ji.start_year) AS yrs_dbt, (year(curdate()) - ji.judge_start_year) AS yrs_judge, r.rating FROM `judging_at` AS ja INNER JOIN users as u ON ja.user_id = u.id INNER JOIN judge_info AS ji ON ja.user_id = ji.id LEFT JOIN (SELECT * FROM ranks WHERE `ranker_id` = ?) AS r ON ja.user_id = r.judge_id WHERE `tournament_id` = ?";
    db.query(sql, [u_id, t_id], (err, result) => {
        if (err) {
            console.error('Database error: ', err);
            return res.status(500).json({error: 'Failed to fetch data'});
        }
        return res.json(result);
    });
});

// Start server to respond to incoming requests
app.listen(port, ()=>{
    console.log('listening')
})