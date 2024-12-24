const mysql = require('mysql2/promise')

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: '',
    database: "pref-buddy",
    port: 3306
})

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
}

module.exports = {
    getJudgeById,
    getAllJudges,
    updateRating,
}