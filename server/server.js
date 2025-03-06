// import dependencies 
const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
const path = require('path')
const jwt = require('jsonwebtoken')
const verifyJWT = require('../middleware/verifyJWT')
const cookieParser = require('cookie-parser')
const { verify } = require('crypto')

require('dotenv').config({path: '../.env'});
const env = process.env.NODE_ENV || 'development';
if (env === 'development') {
    require('dotenv').config({path: '../.env.development'});
} else {
    require('dotenv').config({path: '../.env.production'});
}

const authRoutes = require('./routes/authRoutes')
const tournRoutes = require('./routes/tournRoutes')
const judgeRoutes = require('./routes/judgeRoutes')

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
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
})

app.use('/api/auth', authRoutes)
app.use('/api/tournaments', tournRoutes)
app.use('/api/judges', judgeRoutes)
app.use("/exports", express.static("public/exports"));


// Start server to respond to incoming requests
app.listen(port, ()=>{
    console.log('listening')
})