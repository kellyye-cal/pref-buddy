const mysql = require('mysql2/promise')
const {PythonShell} = require('python-shell')
const {spawn} = require('child_process')
const path = require('path');

const {db} = require('./utils');

// const dbPool = mysql.createPool({
//     host: process.env.DB_HOST || "localhost",
//     user: process.env.DB_USER || "root",
//     password: process.env.DB_PASS || "",
//     database: process.env.DB_NAME || "pref-buddy",
//     port: process.env.DB_PORT || 3306,
//     connectionLimit: 5
// })

const getJudgeById = async({j_id, u_id}) => {
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

    return;
}

const getNotes = async({u_id, j_id}) => {
    const sql = "SELECT notes FROM ranks WHERE judge_id = ? AND ranker_id = ?"

    const [notes] = await db.query(sql, [j_id, u_id])
    return {notes}

}

const saveNote = async({u_id, j_id, note}) => {
    const sql = 'INSERT into ranks (judge_id, ranker_id, notes) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE notes = VALUES(notes)'

    const [postResult] = await db.query(sql, [j_id, u_id, note]);
    return {postResult}
}


const scrapeParadigm = async({j_id}) => {
    const scriptPath = path.join(__dirname, '..', '..','scripts', 'scraper.py')
    const args = ['paradigm', j_id]

    return new Promise((resolve, reject) => {
        // const pythonProcess = spawn('/Library/Frameworks/Python.framework/Versions/3.10/bin/python3', ['-u', scriptPath, ...args])
        const pythonProcess = spawn('python3', ['-u', scriptPath, ...args])
        // const pythonProcess = spawn(process.env.PYTHON_VERSION, ['-u', scriptPath, ...args])
        
        let output = '';
        let errOutput = '';

        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errOutput += data.toString();
            // console.error(`Error from Python: ${data}`)
            // reject(new Error(data.toString()));
        })

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Python script failed with exit code ${code}: ${errOutput}`));
            } else {
                try {
                    const parsedOutput = JSON.parse(output);
                    resolve(parsedOutput.paradigm);
                } catch (err) {
                    reject(new Error('Error parsing Python output: ' + err.message))
                }
            }
        })
    })
}


const getParadigm = async({j_id}) => {
    const sql = "SELECT paradigm, updated FROM judge_info WHERE `id` = ?"

    const [judgeInfo] = await db.query(sql, [j_id])

    let paradigm = judgeInfo[0].paradigm;

    // const lastUpdated = new Date(judgeInfo[0].updated);
    // if (utils.isOlderThanWeek(lastUpdated)) {
    //     scrapeParadigm({j_id})
    //     const getUpdatedParadigm = "SELECT paradigm FROM judge_info WHERE `id` = ?"
    //     const [newParadigm] = await db.query(getUpdatedParadigm, [j_id])

    //     return newParadigm[0].paradigm
    // }

    // scrapeParadigm({j_id})

    return paradigm;
}

module.exports = {
    getJudgeById,
    getAllJudges,
    updateRating,
    getParadigm,
    saveNote,
    getNotes,
}