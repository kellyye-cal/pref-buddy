// import dependencies 
const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const path = require('path')

// create instance of express application, backbone of the server
const app = express()

// set up middleware functions to serve static files, handles client-side assets like CSS and JS
app.use(express.static(path.join(__dirname, "public")))

// Cross-Origin Resource Sharing to manage and control web security
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
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

// app.get('/', (req, res) => {
//     res.send("GET request called to root");
// })


app.get('/api/judge/:id', (req, res) => {
    //in the query, want to join users with judge info
    const j_id = req.params.id;
    const u_id = req.query.u_id;

    const sql = "SELECT *, (year(curdate()) - start_year) AS yrs_dbt, (year(curdate()) - judge_start_year) AS yrs_judge FROM users AS u JOIN (SELECT * FROM judge_info WHERE `id` = ?) AS j on u.id = j.id INNER JOIN ranks on ranks.judge_id = j.id WHERE `ranker_id` = ?";
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
    console.log(rating)

    const sql = "UPDATE ranks SET `rating` = ? WHERE `ranker_id` = ? AND `judge_id` = ?"
    db.query(sql, [rating, u_id, j_id], (err, result) => {
        if (err) {
            console.log("Database error: ", err)
            return res.status(500).json({error: 'Failed to fetch data'});
        }
        return res.status(200).json({success: true, result})
    })
})

// Start server to respond to incoming requests
app.listen(port, ()=>{
    console.log('listening')
})