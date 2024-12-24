const judgeServices = require('../services/judgeServices')

const getJudgeById = async(req, res) => {

    const j_id = req.params.id;
    const u_id = req.query.u_id;

    try {
        const judgeInfo = await judgeServices.getJudgeById({j_id, u_id});
        return res.json(judgeInfo)
    } catch (error) {
        res.status(500).json({message: "Error getting judge information", error})
    }
}

const getAllJudges = async(req, res) => {
    const u_id = req.query.u_id;
    const cookies = req.cookies;

    try {
        const result = await judgeServices.getAllJudges({u_id})

        return res.json(result.judges)

    } catch (error) {
        res.status(500).json({message: "Error getting all judges", error})
    }
}

const setRating = async(req, res) => {
    const {u_id, j_id, rating} = req.body;

    try {
        judgeServices.updateRating({u_id, j_id, rating})
        res.sendStatus(204)
    } catch (error) {
        res.status(500).json({message: "Error updating rating", error})

    }
}

module.exports = {
    getJudgeById,
    getAllJudges,
    setRating,
}