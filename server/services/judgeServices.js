const {db, isOlderThanWeek} = require('./utils');
const scraper = require('../../tabroom/scraper')


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

const getSpeaksById = async ({j_id}) => {
    const sql = "SELECT s1, s2, s3, s4 FROM rounds WHERE judge_id = ?"
    const [rounds] = await db.query(sql, [j_id])

    let total = 0;
    let num = 0;

    for (let round = 0; round < rounds.length; round++) {
        Object.values(rounds[round]).map(speak => {
            if (speak) {
                total += speak;
                num += 1
            }
        })
    }

    if (num == 0) {
        return "--";
    }

    return Math.round((total / num) * 10) / 10;

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

const getRoundsByJudge = async({j_id}) => {
    const sql = "SELECT tournaments.name, tournament_id, judge_id, number, aff, neg, decision, elim_decision, round_type from rounds INNER JOIN tournaments ON tournament_id = tournaments. id WHERE judge_id = ?"

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

module.exports = {
    getJudgeById,
    getSpeaksById,
    getAllJudges,
    updateRating,
    getParadigm,
    saveNote,
    getNotes,
    getRoundsByJudge,
}