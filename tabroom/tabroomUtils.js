require('dotenv').config({ path: '../.env.development' });
const {db} = require('../server/services/utils');
const TurndownService = require('turndown');

const getTimestamp = () => {
   return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

const saveTourn = async({tournament}) => {
    const sql =  "INSERT INTO tournaments (id, link, name, start_date, end_date, j_url, last_updated) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE link = VALUES(link), j_url = VALUES(j_url), name = VALUES(name), start_date = VALUES(start_date), end_date = VALUES(end_date), last_updated = VALUES(last_updated)"
    tournament['last_updated'] = getTimestamp();

    const queryParameters = [
        tournament.id,
        tournament.link,
        tournament.name,
        tournament.start_date,
        tournament.end_date,
        tournament.j_url,
        tournament.last_updated
    ]

    try {
        await db.query(sql, queryParameters);
    } catch (error) {
        console.error(error)
        return {status: "error", message: error.message}
    }
}

const saveJudgesToUsers = async ({judges}) => {
    if (!judges) {
        return
    }
    const sql = `INSERT INTO users (f_name, l_name, affiliation, id, judge)
        VALUES ${judges.map(() => '(?, ?, ?, ?, 1)').join(", ")}
        ON DUPLICATE KEY UPDATE
            f_name = VALUES(f_name),
            l_name = VALUES(l_name),
            affiliation = VALUES(affiliation),
            judge = 1`;

    const queryParameters = judges.flatMap(judge => [
        judge.f_name,
        judge.l_name,
        judge.affiliation,
        judge.tab_id
    ]);

    try {
        await db.query(sql, queryParameters);
    } catch (error) {
        console.error(error)
        return {status: "error", message: error.message}
    }
}

const saveJudgesToRanks = async({judges, u_id}) => {
    const sql = `INSERT IGNORE INTO ranks (judge_id, ranker_id)
        VALUES ${judges.map(() => '(?, ?)').join(", ")}`

    const queryParameters = judges.flatMap(judge => [
        judge.tab_id,
        u_id
    ]);

    try {
        await db.query(sql, queryParameters);
    }  catch (error) {
        console.error(error)
        return {status: "error", message: error.message}
    }
}   

const saveJudgesToTourn = async({judges, t_id}) => {
    const sql = `
        INSERT IGNORE into judging_at (user_id, tournament_id)
        VALUES ${judges.map(() => '(?, ?)').join(", ")}`

    const queryParameters = judges.flatMap(judge => [
        judge.tab_id,
        t_id
    ]);

    try {
        await db.query(sql, queryParameters);
    }  catch (error) {
        console.error(error)
        return {status: "error", message: error.message}
    }
}

const saveJudgesToJudgeInfo = async ({judges}) => {
    const sql = `
        INSERT IGNORE INTO judge_info (id)
        VALUES ${judges.map(() => '(?)').join(", ")}
        `

    const queryParameters = judges.flatMap(judge => [judge.tab_id]);

    try {
        await db.query(sql, queryParameters);
    }  catch (error) {
        console.error(error)
        return {status: "error", message: error.message}
    }
}

const saveUserToAttending = async({u_id, t_id}) => {
    const sql = `
    INSERT IGNORE INTO attending (user_id, tournament_id)
    VALUES (?, ?)
    `

    try {
        await db.query(sql, [u_id, t_id]);
    }  catch (error) {
        console.error(error)
        return {status: "error", message: error.message}
    }
}

const parseHTMLToMD = (html) => {
    const turndownService = new TurndownService();
    return turndownService.turndown(html);
}

const saveParadigm = async ({id, paradigm}) => {
    const sql = `INSERT INTO judge_info (id, paradigm, updated)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE
        paradigm = VALUES(paradigm),
        updated = VALUES(updated)`

    const lastUpdated = getTimestamp();

    try {
        await db.query(sql, [id, paradigm, lastUpdated]);
    }  catch (error) {
        console.error(error)
        return {status: "error", message: error.message}
    }
}

const updateTournTimestamp = async({t_id}) => {
    const sql = "UPDATE tournaments SET last_updated = (?) WHERE id = (?)";

    try {
        await db.query(sql, [getTimestamp(), t_id]);
    } catch (error) {
        console.error(error)
        return {status: "error", message: error.message}
    }
}

const getNumJudges = async (t_id) => {
    const sql = "SELECT COUNT(*) FROM judging_at WHERE tournament_id = ?"

    try {
        const num_judges = await db.query(sql, [t_id])
        return num_judges[0]
    }  catch (error) {
        console.error(error)
        return {status: "error", message: error.message}
    }
}

module.exports = {
    saveTourn,
    saveJudgesToUsers,
    saveJudgesToRanks,
    saveJudgesToTourn,
    saveJudgesToJudgeInfo,
    saveUserToAttending,
    parseHTMLToMD,
    saveParadigm,
    updateTournTimestamp,
    getNumJudges
}