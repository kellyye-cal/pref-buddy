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


app.get('/api/judge', (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Database error: ', err);
            return res.status(500).json({error: 'Failed to fetch data'});
        }
        console.log("Query results: ", result);
        return res.json(result);
    });
});

// Start server to respond to incoming requests
app.listen(port, ()=>{
    console.log('listening')
})