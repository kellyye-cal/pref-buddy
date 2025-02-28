const mysql = require('mysql2/promise')
const {PythonShell} = require('python-shell')
const {spawn} = require('child_process')
const path = require('path');

const utils = require('./utils')


const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: '',
    database: "pref-buddy",
    port: 3306
})

const getJudgeById = async({j_id, u_id}) => {
    // Determine if paradigm has to be scraped by calling scraper.scrape_paradigm

    const sql = "SELECT judge_id, rating, email, affiliation, paradigm,  CONCAT(u.f_name, ' ', u.l_name) AS name, (year(curdate()) - start_year) AS yrs_dbt, (year(curdate()) - judge_start_year) AS yrs_judge FROM users AS u JOIN (SELECT * FROM judge_info WHERE `id` = ?) AS j on u.id = j.id LEFT JOIN ranks on ranks.judge_id = j.id AND `ranker_id` = ?";
    const [judge] = await db.query(sql, [j_id, u_id]);

    return judge;
}

const getAllJudges = async({u_id}) => {
    const sql = "SELECT CONCAT(u.f_name, ' ', u.l_name) AS name, u.id, u.email, u.affiliation, r.rating FROM users as u LEFT JOIN (SELECT * FROM ranks WHERE `ranker_id` = ?) AS r ON u.id = r.judge_id WHERE u.judge = 1 ORDER BY r.rating ASC"

    const [judges] = await db.query(sql, [u_id])
    return {judges}
}

const updateRating = async({u_id, j_id, rating}) => {
    const sql = "INSERT INTO ranks (judge_id, ranker_id, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating = VALUES(rating)"
    const [postResult] = await db.query(sql, [j_id, u_id, rating])
}

const getNotes = async({u_id, j_id}) => {
    const sql = "SELECT notes FROM ranks WHERE judge_id = ? AND ranker_id = ?"
    const [notes] = await db.query(sql, [j_id, u_id])

    return {notes}
}

const saveNote = async({u_id, j_id, note}) => {
    const sql = 'INSERT into ranks (judge_id, ranker_id, notes) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE notes = VALUES(notes)'
    const [postResult] = await db.query(sql, [j_id, u_id, note])

    return {postResult}
}


const scrapeParadigm = async({j_id}) => {
    const scriptPath = path.join(__dirname, '..', '..','scripts', 'scraper.py')
    const args = ['paradigm', j_id]

    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('/Library/Frameworks/Python.framework/Versions/3.10/bin/python3', ['-u', scriptPath, ...args])

        let output = '';

        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Error from Python: ${data}`)
            reject(new Error(data.toString()));
        })

        pythonProcess.on('close', (code) => {
            try {
                console.log(output)
                const parsedOutput = JSON.parse(output);
                resolve(parsedOutput.paradigm);
            } catch (err) {
                reject(new Error('Error parsing Python output: ' + err.message))
            }
        })
    })
}


const getParadigm = async({j_id}) => {
    await scrapeParadigm({j_id})

    const sql = "SELECT paradigm FROM judge_info WHERE `id` = ?"
    const [judgeInfo] = await db.query(sql, [j_id])

    const paradigm = judgeInfo[0].paradigm;

    return paradigm
}

module.exports = {
    getJudgeById,
    getAllJudges,
    updateRating,
    getParadigm,
    saveNote,
    getNotes,
}