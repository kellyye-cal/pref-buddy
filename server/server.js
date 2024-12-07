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
    const id = req.params.id;
    const sql = "SELECT *, (year(curdate()) - start_year) AS yrs_dbt, (year(curdate()) - judge_start_year) AS yrs_judge FROM users AS u JOIN (SELECT * FROM judge_info WHERE `id` = ?) AS j on u.id = j.id";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Database error: ', err);
            return res.status(500).json({error: 'Failed to fetch data'});
        }
                
        return res.json(result);
    });
});

app.get('/api/ratings/', (req, res) => {
    const u_id = req.query.u_id;
    const j_id = req.query.j_id;
    
    const sql = "SELECT rating FROM ranks WHERE `judge_id` = ? AND `ranker_id` = ? LIMIT 1"
    db.query(sql, [j_id, u_id], (err, result) => {
        if (err) {
            console.error('Database error: ', err);
            return res.status(500).json({error: 'Failed to fetch data'});
        }
        
        console.log("Query results: ", result, req);
        return res.json(result);
    })

});

// Start server to respond to incoming requests
app.listen(port, ()=>{
    console.log('listening')
})