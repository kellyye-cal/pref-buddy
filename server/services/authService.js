const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const verifyJWT = require('../../middleware/verifyJWT')
// require('dotenv').config({path: '../../.env'});

// const db = mysql.createPool({
//     host: "localhost",
//     user: "root",
//     password: '',
//     database: "pref-buddy",
//     port: 3306
// })
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
})

const registerUser = async({email, fname, lname, pwd}) => {
    try {
        //check if user exists
        const findDuplicate = "SELECT email FROM users where `email` = ?"
        const [existingUsers] = await db.query(findDuplicate, [email]);

        if (existingUsers.length >= 1) throw new Error("User already exists with this email.")

        // hash password
        const hashedPwd = await bcrypt.hash(pwd, 10)

        // concat name to enter into record

        //insert new user into database
        const insertSQL = "INSERT INTO users (f_name, l_name, email, password) VALUES (?, ?, ?, ?, ?)"
        const [result] = await db.query(insertSQL, [fname, lname, email, hashedPwd])

        return {id: result.insertId, email}

    } catch (error) {
        throw new Error(error.message)
    }
}

const login = async({email, pwd}) => {
    // Query database for login credentials
    const sql = "SELECT id, password, f_name, l_name, admin FROM users WHERE `email` = ?"
    const [result] = await db.query(sql, [email]);
    if (result.length < 1) throw new Error('No account with that username');

    // Verify password match
    var match = await bcrypt.compare(pwd, result[0].password)
    const userId = result[0].id;

    // If there is a match, need to create JWTs
    if (match) {
        // create JWTs
        const accessToken = jwt.sign(
            {"id":result[0].id},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '1h'}
        );

        const refreshToken = jwt.sign(
            {"id":result[0].id},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '7d'}
        );

        // Add refresh token to database
        const refreshTokenSQL = "UPDATE users SET `refresh_token` = ? WHERE `email` = ?"
        const [insertResult] = await db.query(refreshTokenSQL, [refreshToken, email])

        const name = result[0].f_name + " " + result[0].l_name
        // Send cookie with refreshToken and return accessToken & userId
        return {refreshToken, accessToken, userId, name: name, admin: result[0].admin};
    }
}

const createUser = async({email, fname, lname, pwd, affiliation, judge, coach, debater}) => {
    try {
        //check if user exists
        const findDuplicate = "SELECT email FROM users where `email` = ?"
        const [existingUsers] = await db.query(findDuplicate, [email]);

        if (existingUsers.length >= 1) throw new Error("User already exists with this email.")

        // hash password
        const hashedPwd = await bcrypt.hash(pwd, 10)

        console.log("hashed pwd")

        //insert new user into database
        const insertSQL = "INSERT INTO users (f_name, l_name, email, password, affiliation, judge, coach, debater) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        const [result] = await db.query(insertSQL, [fname, lname, email, hashedPwd, affiliation, judge, coach, debater])

        console.log(result)
        return {id: result.insertId, email}

    } catch (error) {
        throw new Error(error.message)
    }
}

const verifyToken = (token, secret) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) return reject(err);
            resolve(decoded)
        })
    })
}

const refreshAccessToken = async({refreshToken}) => {
    const findUser = "SELECT * FROM users WHERE `refresh_token` = ?"
    const [user] = await db.query(findUser, [refreshToken])

    if (user.length === 0) throw new Error("Forbidden")

    try {
        const decoded = await verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        if (user[0].id !== decoded.id) {
            throw new Error("Forbidden");
        }

        const accessToken = jwt.sign(
            {id: decoded.id},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: "1h"}
        );

        return {accessToken: accessToken, admin: user[0].admin}
    } catch (error) {
        throw new Error(error.message)
    }
}

const verifyRefreshToken = async({refreshToken, id}) => {
    const checkToken = "SELECT refresh_token FROM users where `refresh_token` = ? AND `id`= ?"
    const [tokenResult] = await db.query(checkToken, [refreshToken, id])

    if (tokenResult.length === 0) throw new Error("No matching refresh token found")
}

const removeToken = async({id}) => {
    const removeToken = "UPDATE users SET `refresh_token` = '' WHERE `id` = ?"
    const [removed] = await db.query(removeToken, [id])
}

module.exports = {
    registerUser,
    login,
    createUser,
    refreshAccessToken,
    verifyRefreshToken,
    removeToken,
};