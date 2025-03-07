const mysql = require('mysql2/promise')
require('dotenv').config({path: '../../.env.development'});

const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "pref-buddy",
    port: process.env.DB_PORT || 3306,
    connectionLimit: 5,
    connectTimeout: 60000
})

function isOlderThanWeek(date) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7)

    return date < weekAgo
}

module.exports = {
    isOlderThanWeek,
    db
}