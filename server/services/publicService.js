require('dotenv').config({path: '../../.env.development'});

const {db} = require('./utils');

const getAllTournaments = async() => {
    const sql = "SELECT * FROM tournaments"
    
    const [tournaments] = await db.query(sql)
    return tournaments;

}

const getRoundsSpecified = async(id) => {
    const sql = `
    SELECT
        COUNT(*) AS total_entries,
        COUNT(CASE WHEN round_type IS NULL OR round_type = '' THEN 1 END) AS empty
    FROM rounds
    WHERE rounds.tournament_id = ?;`

    const [roundsSpecified] = await db.query(sql, [id])
    return roundsSpecified;
}

const getRoundsByTournId = async(id) => {
    const sql = `SELECT aff, decision, elim_decision, CONCAT(users.f_name, ' ', users.l_name) AS judge_name, judge_id, neg, number, round_type, s1, s2, s3, s4
                FROM rounds
                INNER JOIN users ON rounds.judge_id = users.id
                WHERE tournament_id = ?`
    const [rounds] = await db.query(sql, [id])

    return rounds;
}

const getTournamentById = async(id) => {
    const sql = "SELECT * FROM tournaments WHERE id = ?"

    const [tournInfo] = await db.query(sql, [id])

    return tournInfo[0];
}

const searchJudges = async(searchTerm) => {
    
    const sql = "SELECT id, CONCAT(f_name, ' ', l_name) AS name, affiliation FROM users WHERE LOWER(CONCAT(f_name, ' ', l_name)) LIKE ?"

    const [results] = await db.query(sql, [`%${searchTerm}%`])

    return results;
}

const getJudgeById = async(id) => {
    const sql = "SELECT f_name, l_name, affiliation, paradigm FROM users INNER JOIN (SELECT * FROM judge_info WHERE `id` = ?) AS ji on ji.id = users.id"

    const [judgeInfo] = await db.query(sql, [id])
    return judgeInfo;
}

module.exports = {
    getAllTournaments,
    getRoundsByTournId,
    getTournamentById,
    getRoundsSpecified,
    searchJudges,
    getJudgeById
};