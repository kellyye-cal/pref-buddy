// const mysql = require('mysql2/promise')
const path = require('path');
const fs = require("fs");
const { format } = require('fast-csv');

const {db, getPrefs} = require('./utils');
const scraper = require('../../tabroom/scraper')
const judgeServices = require('./judgeServices');

const getMyTournaments = async({id}) => {
    const sql = "SELECT *, 1 AS attending FROM attending AS a INNER JOIN tournaments AS t ON a.tournament_id = t.id WHERE `user_id` = ?"

    const [tournaments] = await db.query(sql, [id])
    return tournaments
}

const getMyJudging = async({id}) => {
    const sql = "SELECT *, 1 as judging FROM judging_at AS j INNER JOIN tournaments AS t ON j.tournament_id = t.id WHERE `user_id` = ?"
    const [tournaments] = await db.query(sql, [id])

    return tournaments
}

const getAllTournaments = async({id}) => {
    const sql = "SELECT tournaments.id AS t_id, tournaments.link, tournaments.name, tournaments.name, tournaments.start_date, tournaments.end_date, CASE WHEN a.user_id IS NOT NULL THEN 1 ELSE 0 END AS attending, CASE WHEN j.user_id IS NOT NULL THEN 1 ELSE 0 END AS judging FROM tournaments LEFT JOIN (SELECT * FROM attending WHERE user_id = ?) AS a on a.tournament_id = tournaments.id LEFT JOIN (SELECT * FROM judging_at WHERE user_id = ?) AS j on j.tournament_id = tournaments.id"    

    const [tournaments] = await db.query(sql, [id, id])
    return tournaments
}

// const updateJudgeList = async({t_id, j_url}) => {
//     const scriptPath = path.join(__dirname, '..', '..','scripts', 'scraper.py')
//     const args = ["update_judge_list", t_id, j_url]

//     return new Promise((resolve, reject) => {
//         // const pythonProcess = spawn('/Library/Frameworks/Python.framework/Versions/3.10/bin/python3', ['-u', scriptPath, ...args])
//         const pythonProcess = spawn('python3', ['-u', scriptPath, ...args])


//         pythonProcess.stderr.on('data', (data) => {
//             console.error(`Error from Python: ${data}`)
//             reject(new Error(data.toString()));
//         })

//         pythonProcess.on('close', (code) => {
//             resolve("Success")
//         })
//     })
// }

const getTournamentById = async({t_id}) => {
    const sql = "SELECT * FROM tournaments WHERE `id` = ?"
    const [tournaments] = await db.query(sql, [t_id])

    const now = new Date()
    const end = new Date(tournaments[0].end_date)
    const last_updated = new Date(tournaments[0].last_updated)
    const since_updated = now - last_updated


    if (end > now && since_updated > 2 * 60 * 60 * 1000) {
        scraper.updateTournament({t_id, j_url: tournaments[0].j_url})
    }

    return tournaments[0];
}

const getTournamentByIdJudging = async({t_id, j_id}) => {
    const check_judging = "SELECT * FROM judging_at WHERE `user_id` = ? AND `tournament_id` = ?"
    const [attendance] = await db.query(check_judging, [j_id, t_id])
    
    var judging_at = {}
    
    if (attendance.length === 0) {
        judging_at.judging = false
        return judging_at
    } else {
        const getRoundHistory = "SELECT * FROM rounds WHERE `tournament_id` = ? AND `judge_id` = ?"
        const [roundHistory] = await db.query(getRoundHistory, [t_id, j_id])

        const totalRounds = roundHistory.length;
        var specified = 0;

        for (let i = 0; i < totalRounds; i++) {
            if (roundHistory[i].round_type) {
                specified += 1;
            }
        }

        judging_at = {
            judging: true,
            specified,
            totalRounds,
            roundHistory
        }

        return judging_at;
    }
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

    for (let i = 0; i < judges.length; i++) {
        const judge = judges[i]

        const speaks = await judgeServices.getSpeaksById({j_id: judge.j_id});
        judges[i].speaks = speaks;

        const numRounds = await judgeServices.getRoundsByJudge({j_id: judge.j_id});
        judges[i].numRounds = numRounds.length;
    }
    
    return judges;
}

const scrapeTournament = async({url, u_id}) => {
    const result = await scraper.scrapeTourn({url, u_id});
    return result.data.tourn_id;
}

const saveRoundType = async ({t_id, round, j_id, type}) => {
    const sql = `
    UPDATE rounds
    SET round_type = ?
    WHERE tournament_id = ? AND number = ? AND judge_id = ?`
    await db.query(sql, [type, t_id, round, j_id])
    return
}

// const scrapeTournament = async({url, u_id}) => {

//     const scriptPath = path.join(__dirname, '..', '..','scripts', 'scraper.py')
//     const args = ['tournament', url, u_id]

//     return new Promise((resolve, reject) => {
//         // const pythonProcess = spawn('/Library/Frameworks/Python.framework/Versions/3.10/bin/python3', ['-u', scriptPath, ...args])
//         const pythonProcess = spawn('python3', ['-u', scriptPath, ...args])

//         let output = '';

//         pythonProcess.stdout.on('data', (data) => {
//             output += data.toString();
//         });

//         pythonProcess.stderr.on('data', (data) => {
//             console.error(`Error from Python: ${data}`)
//             reject(new Error(data.toString()));
//         })

//         pythonProcess.on('close', (code) => {
//             try {
//                 const parsedOutput = JSON.parse(output);
//                 const tourn_id = parsedOutput.data.tourn_id;

//                 resolve(tourn_id);
//             } catch (err) {
//                 console.error(err)
//                 reject(new Error('Error parsing Python output: ' + err.message))
//             }
//         })
//     })

// }

const exportPrefsToCSV = async({t_id, u_id, filename}) => {
    const filePath = path.join(__dirname, "..", "..", "client", "public", "exports", filename);

    try {
        const [prefs] = await getPrefs({t_id, u_id})

        fs.mkdirSync(path.dirname(filePath), { recursive: true });

        const ws = fs.createWriteStream(filePath);
        const csvStream = format({ headers: true });

        csvStream.pipe(ws);
        prefs.forEach(row => csvStream.write(row));
        csvStream.end();

        return {status: "success", fileName: filePath}
    } catch (error) {
        console.error("Error exporting CSV: ", error);
        return {status: 'error', message: error.message}
    }
}

module.exports = {
    getMyTournaments,
    getMyJudging,
    getAllTournaments,
    getNumRated,
    getNumJudges,
    getJudges,
    getTournamentById,
    getTournamentByIdJudging,
    scrapeTournament,
    exportPrefsToCSV,
    saveRoundType,
}