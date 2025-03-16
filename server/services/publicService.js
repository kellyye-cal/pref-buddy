require('dotenv').config({path: '../../.env.development'});

const {db} = require('./utils');

const getAllTournaments = async() => {
    const sql = "SELECT * FROM tournaments"
    
    const [tournaments] = await db.query(sql)
    return tournaments;

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

module.exports = {
    getAllTournaments,
    getRoundsByTournId,
    getTournamentById
};