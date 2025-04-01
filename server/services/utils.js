const mysql = require('mysql2/promise')
const redis = require("redis");
require('dotenv').config({path: '../../.env.development'});

const client = redis.createClient({
    url: process.env.REDIS_URL,
    socket: process.env.NODE_ENV === "production" ? {
        tls: true,
        rejectUnauthorized: false
    } : {}
});

client.connect();

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

async function getPrefs({t_id, u_id}) {
    const sql = "SELECT CONCAT(u.f_name, ' ', u.l_name) AS name, rating FROM users as u INNER JOIN (SELECT r.judge_id, r.rating FROM ranks AS r INNER JOIN judging_at as j ON r.judge_id = j.user_id WHERE j.tournament_id = ? AND r.ranker_id = ?) AS prefs on prefs.judge_id = u.id;"
    const prefs = await db.query(sql, [t_id, u_id]); 
    
    return prefs;
}

module.exports = {
    isOlderThanWeek,
    getPrefs,
    db,
    client
}