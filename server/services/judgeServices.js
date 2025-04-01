const {db, isOlderThanWeek, client} = require('./utils');
const scraper = require('../../tabroom/scraper')

/**
 * Fetches a judge by their ID from the database for a given user.
 * @param {Integer} j_id - the ID of the judge you are requesting info for
 * @param {Integer} u_id - the ID of the user making the request
 * @returns {Object} An object representing a judge with fields
 *                   (judge_id) - ID of the judge
 *                   (rating) - rating of judge with j_id by user with u_id
 *                   (email) - the judge's email
 *                   (affiliation) - the judge's school affiliation
 *                   (paradigm) - the judge's paradigm
 *                   (name) - the judge's first and last name
 *                   (yrs_dbt) - the number of years that a judge has been in debate
 *                   (yrs_judge) - the number of years that a judge has been judging
 */
const getJudgeById = async({j_id, u_id}) => {
    const sql = "SELECT judge_id, rating, email, affiliation, paradigm,  CONCAT(u.f_name, ' ', u.l_name) AS name, (year(curdate()) - start_year) AS yrs_dbt, (year(curdate()) - judge_start_year) AS yrs_judge FROM users AS u JOIN (SELECT * FROM judge_info WHERE `id` = ?) AS j on u.id = j.id LEFT JOIN ranks on ranks.judge_id = j.id AND `ranker_id` = ?";
    const [judge] = await db.query(sql, [j_id, u_id]);

    return judge;
}

const getSpeaksById = async ({j_id}) => {
    const mean_sql = `SELECT 
    ROUND(
        (SUM(CASE WHEN s1 IS NOT NULL THEN s1 END) + 
         SUM(CASE WHEN s2 IS NOT NULL THEN s2 END) + 
         SUM(CASE WHEN s3 IS NOT NULL THEN s3 END) + 
         SUM(CASE WHEN s4 IS NOT NULL THEN s4 END)
        ) / 
        (COUNT(CASE WHEN s1 IS NOT NULL THEN 1 END) + 
         COUNT(CASE WHEN s2 IS NOT NULL THEN 1 END) + 
         COUNT(CASE WHEN s3 IS NOT NULL THEN 1 END) + 
         COUNT(CASE WHEN s4 IS NOT NULL THEN 1 END)
        ), 
    1) AS avg
    FROM rounds
    WHERE judge_id = ?`

    const sd_sql = `SELECT
    ROUND(
        STDDEV_POP(value), 
    1) AS sd
    FROM (
        SELECT s1 AS value FROM rounds WHERE s1 IS NOT NULL AND judge_id = ?
        UNION ALL
        SELECT s2 FROM rounds WHERE s2 IS NOT NULL AND judge_id = ?
        UNION ALL
        SELECT s3 FROM rounds WHERE s3 IS NOT NULL AND judge_id = ?
        UNION ALL
        SELECT s4 FROM rounds WHERE s4 IS NOT NULL AND judge_id = ?
    ) AS combined_values;`
     
    const [avgRes] = await db.query(mean_sql, [j_id])
    const [sdRes] = await db.query(sd_sql, [j_id, j_id, j_id, j_id])

    const avg = avgRes[0].avg;
    const sd = sdRes[0].sd;

    const stats = {avg, sd}
    return stats;

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

    if (notes.length == 0) {
        db.query("INSERT INTO ranks (judge_id, ranker_id) VALUES (?, ?)", [j_id, u_id])
        return ({notes: ""})
    }
    return (notes[0])

}

const saveNote = async({u_id, j_id, note}) => {
    const sql = 'INSERT into ranks (judge_id, ranker_id, notes) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE notes = VALUES(notes)'

    const [postResult] = await db.query(sql, [j_id, u_id, note]);
    return {postResult}
}

const getRoundsByJudge = async({j_id}) => {
    const sql = "SELECT tournaments.start_date, tournaments.name, tournament_id, judge_id, number, aff, neg, decision, elim_decision, round_type from rounds INNER JOIN tournaments ON tournament_id = tournaments. id WHERE judge_id = ?"

    const [rounds] = await db.query(sql, j_id)
    return rounds
}


// const scrapeParadigm = async({j_id}) => {
//     const scriptPath = path.join(__dirname, '..', '..','scripts', 'scraper.py')
//     const args = ['paradigm', j_id]

//     return new Promise((resolve, reject) => {
//         // const pythonProcess = spawn('/Library/Frameworks/Python.framework/Versions/3.10/bin/python3', ['-u', scriptPath, ...args])
//         const pythonProcess = spawn('python3', ['-u', scriptPath, ...args])
//         // const pythonProcess = spawn(process.env.PYTHON_VERSION, ['-u', scriptPath, ...args])
        
//         let output = '';
//         let errOutput = '';

//         pythonProcess.stdout.on('data', (data) => {
//             output += data.toString();
//         });

//         pythonProcess.stderr.on('data', (data) => {
//             errOutput += data.toString();
//             // console.error(`Error from Python: ${data}`)
//             // reject(new Error(data.toString()));
//         })

//         pythonProcess.on('close', (code) => {
//             if (code !== 0) {
//                 reject(new Error(`Python script failed with exit code ${code}: ${errOutput}`));
//             } else {
//                 try {
//                     const parsedOutput = JSON.parse(output);
//                     resolve(parsedOutput.paradigm);
//                 } catch (err) {
//                     reject(new Error('Error parsing Python output: ' + err.message))
//                 }
//             }
//         })
//     })
// }

const scrapeCache = new Map();

const getParadigm = async({j_id}) => {
    const sql = "SELECT paradigm, updated FROM judge_info WHERE `id` = ?"

    const [judgeInfo] = await db.query(sql, [j_id])
    const lastUpdated = new Date(judgeInfo[0].updated);
    if (isOlderThanWeek(lastUpdated)) {
        if (scrapeCache.has(j_id)) {
            return scrapeCache.get(j_id);
        }
        
        const scrapePromise = scraper.scrapeParadigm(j_id)
        .then(scrapedParadigm => {
            scrapeCache.delete(j_id); // Remove from cache once done
            return scrapedParadigm;
        })
        .catch(err => {
            scrapeCache.delete(j_id); // Ensure it gets removed even if there's an error
            throw err;
        });

        scrapeCache.set(j_id, scrapePromise);
        return scrapePromise;
    } else {
        return judgeInfo[0].paradigm;
    }
}

const getJudgeStats = async ({j_id}) => {
    const sql = "SELECT round_type, decision FROM rounds WHERE judge_id = ?"
    const [results] = await db.query(sql, j_id)

    stats = {
        PvP: {Aff: 0, Neg: 0},
        PvK: {Aff: 0, Neg: 0},
        KvP: {Aff: 0, Neg: 0},
        KvK: {Aff: 0, Neg: 0},
        T: {Aff: 0, Neg: 0},
    }
    
    results.map(round => {
        if (round.round_type === "Policy v. Policy") {
            stats.PvP[round.decision] = stats.PvP[round.decision] + 1
        } else if (round.round_type === "Policy v. K") {
            stats.PvK[round.decision] = stats.PvK[round.decision] + 1
        } else if (round.round_type === "K v. Policy") {
            stats.KvP[round.decision] = stats.KvP[round.decision] + 1
        } else if (round.round_type === "K v. K") {
            stats.KvK[round.decision] = stats.KvK[round.decision] + 1
        } else if (round.round_type === "T/Theory") {
            stats.T[round.decision] = stats.T[round.decision] + 1
        }
    })

    return stats;
}

const getUpcomingTournaments = async({j_id}) => {
    const sql = "SELECT * FROM tournaments AS t INNER JOIN judging_at AS j on j.tournament_id = t.id WHERE `user_id` = ? AND start_date > NOW()"

    const [tournaments] = await db.query(sql, [j_id])
    return tournaments
}


module.exports = {
    getJudgeById,
    getSpeaksById,
    getAllJudges,
    updateRating,
    getParadigm,
    saveNote,
    getNotes,
    getRoundsByJudge,
    getJudgeStats,
    getUpcomingTournaments
}