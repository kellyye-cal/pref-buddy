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
app.use(cors())

// Parse JSON data from HTTP requests to process data sent from the client
app.use(express.json())

// Configure the application port to specify where server listens for incoming requests
const port = 5000

// Establish connection to MySQL database to ensure it interacts effectively
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "H556Fz62",
    database: "prefbuddy"
})

// Start server to respond to incoming requests
app.listen(port, ()=>{
    console.log('listening')
})