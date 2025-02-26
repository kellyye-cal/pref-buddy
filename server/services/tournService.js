const mysql = require('mysql2/promise')
const verifyJWT = require('../../middleware/verifyJWT')
const {PythonShell} = require('python-shell')
const {spawn} = require('child_process')
const path = require('path');

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: '',
    database: "pref-buddy",
    port: 3306
})

const getMyTournaments = async({id}) => {
    const sql = "SELECT *, 1 AS attending FROM attending AS a INNER JOIN tournaments AS t ON a.tournament_id = t.id WHERE `user_id` = ?"
    const [tournaments] = await db.query(sql, [id])

    return tournaments
}

const getAllTournaments = async({id}) => {
    const sql = "SELECT tournaments.id AS t_id, tournaments.link, tournaments.name, tournaments.name, tournaments.start_date, tournaments.end_date, CASE WHEN a.user_id IS NOT NULL THEN 1 ELSE 0 END AS attending, CASE WHEN j.user_id IS NOT NULL THEN 1 ELSE 0 END AS judging FROM tournaments LEFT JOIN (SELECT * FROM attending WHERE user_id = 1) AS a on a.tournament_id = tournaments.id LEFT JOIN (SELECT * FROM judging_at WHERE user_id = 1) AS j on j.tournament_id = tournaments.id"    
    const [tournaments] = await db.query(sql, [id])
    
    return tournaments
}

const getTournamentById = async({t_id}) => {
    const sql = "SELECT * FROM tournaments WHERE `id` = ?"
    const [tournaments] = await db.query(sql, [t_id])

    return tournaments[0]
}

const getNumRated = async({t_id, u_id}) => {
    const numRatedQuery = "SELECT COUNT(*) FROM judging_at INNER JOIN ranks on judging_at.user_id = ranks.judge_id WHERE `tournament_id` = ? AND `ranker_id` = ? AND `rating` IS NOT NULL AND `rating` > 0"
    const [ratedResult] = await db.query(numRatedQuery, [t_id, u_id]);

    return (ratedResult[0]['COUNT(*)'])
}

const getNumJudges = async({t_id}) => {
    const numJudgesQuery = "SELECT COUNT(*) from judging_at WHERE `tournament_id` = ?"
    const [judgesResult] = await db.query(numJudgesQuery, [t_id]);

    return (judgesResult[0]['COUNT(*)'])

}

const getJudges = async({u_id, t_id}) => {
    const sql = "SELECT ja.user_id AS j_id, CONCAT(u.f_name, ' ', u.l_name) AS name, u.affiliation, ji.paradigm, (year(curdate()) - ji.start_year) AS yrs_dbt, (year(curdate()) - ji.judge_start_year) AS yrs_judge, r.rating FROM `judging_at` AS ja INNER JOIN users as u ON ja.user_id = u.id INNER JOIN judge_info AS ji ON ja.user_id = ji.id LEFT JOIN (SELECT * FROM ranks WHERE `ranker_id` = ?) AS r ON ja.user_id = r.judge_id WHERE `tournament_id` = ?";
    const [judges] = await db.query(sql, [u_id, t_id])

    return judges;
}

const scrapeTournament = async({url, u_id}) => {

    const scriptPath = path.join(__dirname, '..', '..','scraper', 'scraper.py')
    const args = ['tournament', url, u_id]

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
                const parsedOutput = JSON.parse(output);
                const tourn_id = parsedOutput.data.tourn_id;

                resolve(tourn_id);
            } catch (err) {
                console.log(err)
                reject(new Error('Error parsing Python output: ' + err.message))
            }
        })
    })

}

module.exports = {
    getMyTournaments,
    getAllTournaments,
    getNumRated,
    getNumJudges,
    getJudges,
    getTournamentById,
    scrapeTournament
}