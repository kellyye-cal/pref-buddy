// import dependencies 
const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
const path = require('path')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const verifyJWT = require('../middleware/verifyJWT')
const cookieParser = require('cookie-parser')
require('dotenv').config({path: '../.env'});

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
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
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

app.post('/register', async (req, res) => {
    const {email, fname, lname, pwd} = req.body;
    if (!email || !pwd) return res.status(400).json({'message': 'Valid email and password are required'});

    // check for duplicate emails
    const findDuplicate = "SELECT email FROM users where `email` = ?"
    db.query(findDuplicate, [email], (err, result) => {
        if (err) {
            console.error("Database error: ", err);
            return res.status(500).json({error: 'Database error'})
        }
        if (result.length >= 1) return res.sendStatus(409);
    })

    try {
        // encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10)
        const name = fname + " " + lname

        // store the new user
        const insertSQL = "INSERT INTO users (f_name, l_name, email, name, password) VALUES (?, ?, ?, ?, ?)"
        db.query(insertSQL, [fname, lname, email, name, hashedPwd], (err, result) => {
            if (err) {
                console.log("Database error: ", err)
                return res.status(500).json({error: 'Database error when creating account'});
            }
            console.log(result)
            return res.status(200).json({success: true, result})
        })

    } catch (err) {
        res.status(500).json({'message': err.message})
    }


})

app.post('/auth', async (req, res) => {
    const {email, pwd} = req.body;

    if (!email || !pwd ) return res.status(400).json({'message': 'Email and password are required.'})
    
    const sql = "SELECT id, password FROM users WHERE `email` = ?"

    db.query(sql, [email, pwd], (err, result) => {
        if (err) {
            console.error("Database error when logging in ", err);
            return res.status(500).json({error: 'Failed to fetch data'})
        }
        
        if (result.length < 1) return res.status(401).json({error: 'No account with that username'})
        var match = bcrypt.compare(pwd, result[0].password)
        const userId = result[0].id;
        if (match) {
            // create JWTs
            const accessToken = jwt.sign(
                {"id":result[0].id},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '300s'}
            );

            const refreshToken = jwt.sign(
                {"id":result[0].id},
                process.env.REFRESH_TOKEN_SECRET,
                {expiresIn: '1d'}
            );

            const refreshTokenSQL = "UPDATE users SET `refresh_token` = ? WHERE `email` = ?"
            db.query(refreshTokenSQL, [refreshToken, email], (err, result) => {
                if (err) return res.status(500).json({error: 'Database error'})
            })


            // post the refresh token to the users database
            res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000})
            res.json({accessToken, userId});
        } else {
            res.sendStatus(401)
        }
    })
    
})


app.get('/api/judge/:id', (req, res) => {
    //in the query, want to join users with judge info
    const j_id = req.params.id;
    const u_id = req.query.u_id;

    const sql = "SELECT *,  (year(curdate()) - start_year) AS yrs_dbt, (year(curdate()) - judge_start_year) AS yrs_judge FROM users AS u JOIN (SELECT * FROM judge_info WHERE `id` = ?) AS j on u.id = j.id INNER JOIN ranks on ranks.judge_id = j.id WHERE `ranker_id` = ?";
    db.query(sql, [j_id, u_id], (err, result) => {
        if (err) {
            console.error('Database error: ', err);
            return res.status(500).json({error: 'Failed to fetch data'});
        }
                
        return res.json(result);
    });
});

app.get('/api/alljudges', (req, res) => {
    const u_id = req.query.u_id;

    const sql = "SELECT * FROM users as u LEFT JOIN (SELECT * FROM ranks WHERE `ranker_id` = ?) AS r ON u.id = r.judge_id WHERE u.judge = 1 ORDER BY r.rating ASC"
    // create judge, user pairs -> join with rankings
    // SELECT * FROM ranks AS r RIGHT JOIN (SELECT u1.id AS user_id, u2.id AS judge_id FROM `users` AS u1 JOIN `users` AS u2 WHERE u2.judge = 1) as u ON u.user_id = r.ranker_id AND u.judge_id = r.judge_id where user_id = 0;
    db.query(sql, [u_id], (err, result) => {
        if (err) {
            console.error('Database error: ', err);
            return res.status(500).json({error: 'Failed to fetch data'});
        }
        
        return res.json(result);
    })
})

app.post('/api/set_rating/', (req, res) => {
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
    const u_id = req.user

    const sql = "SELECT * FROM attending AS a INNER JOIN tournaments AS t ON a.tournament_id = t.id WHERE `user_id` = ?"
    db.query(sql, [u_id], (err, result) => {
        if (err) {
            return res.status(500).json({error: 'Failed to fetch data from tournaments table'});
        }
        console.log(result)
        return res.json(result)
    })
})

app.get('/api/tournaments/:id', verifyJWT, async (req, res) => {
    const t_id = req.params.id;
    const u_id = req.user

    try {
        var numRated;
        var numJudges;

        const numRatedQuery = "SELECT COUNT(*) FROM judging_at INNER JOIN ranks on judging_at.user_id = ranks.judge_id WHERE `tournament_id` = ? AND `ranker_id` = ? AND `rating` IS NOT NULL AND `rating` > 0"
        const [ratedResult] = await db.promise().query(numRatedQuery, [t_id, u_id]);
        // db.query(num_rated_query, [t_id, u_id], (err, result) => {
        //     if (err) {
        //         console.log("Database error: ", err);
        //         return res.status(500).json({error: 'Failed to fetch data from tournaments table'});
        //     }
        //     numRated = result
        // })

        const numJudgesQuery = "SELECT COUNT(*) from judging_at WHERE `tournament_id` = ?"
        const [judgesResult] = await db.promise().query(numJudgesQuery, [t_id]);
        // db.query(num_judges_query, [t_id], (err, result) => {
        //     if (err) {
        //         console.log("Database error: ", err);
        //         return res.status(500).json({error: 'Failed to fetch data from tournaments table'});
        //     }
        //     numJudges = result
        // })
        return res.json([ratedResult[0]['COUNT(*)'], judgesResult[0]['COUNT(*)']])
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch data from tournaments table' });
    }
})

// Start server to respond to incoming requests
app.listen(port, ()=>{
    console.log('listening')
})