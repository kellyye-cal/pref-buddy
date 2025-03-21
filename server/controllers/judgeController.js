const judgeServices = require('../services/judgeServices')
const validator = require('validator');

const getJudgeById = async(req, res) => {

    const j_id = req.params.id;
    const u_id = req.query.u_id;

    if (!validator.isNumeric(j_id)) {
        return res.status(400).json({ error: "Invalid tournament ID" });
    }

    var judgeInfo;
    var paradigm = ""
    var avg_speaks;
    var stats;

    try {
        judgeInfo = await judgeServices.getJudgeById({j_id, u_id});
    } catch (error) {
        return res.status(500).json({message: "Error getting judge information", error})
    }

    try {
        paradigm = await judgeServices.getParadigm({j_id});
    } catch (error) {
        return res.status(500).json({message: "Error getting paradigm", error})
    }

    try {
        avg_speaks = await judgeServices.getSpeaksById({j_id})
    } catch (error) {
        return res.status(500).json({message: "Error getting average speaks", error})
    }

    try {
        stats = await judgeServices.getJudgeStats({j_id})
    } catch (error) {
        return res.status(500).json({message: "Error getting stats", error})
    }

    return res.json({judgeInfo, paradigm, avg_speaks, stats})

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

const getNotes = async(req, res) => {
    const {u_id, j_id} = req.query;    
    try {
        const result = await judgeServices.getNotes({u_id, j_id});
        return res.json({notes: result.notes})
    } catch (error) {
        res.status(500).json({message: "Error fetching notes", error})
    }
}

const saveNote = async(req, res) => {
    const {u_id, j_id, note} = req.body;

    try {
        await judgeServices.saveNote({u_id, j_id, note})
        res.sendStatus(204)
    } catch (error) {
        res.status(500).json({message: "Error updating rating", error})
    }
}

const getRoundsByJudge = async(req, res) => {
    const j_id = req.params.id;
    const u_id = req.query.u_id;

    try {
        const rounds = await judgeServices.getRoundsByJudge({j_id});
        return res.json(rounds)
    } catch (error) {
        res.status(500).json({message: `Error getting rounds for judge ${j_id}: `, error})
    }
}

module.exports = {
    getJudgeById,
    getAllJudges,
    setRating,
    getNotes,
    saveNote,
    getRoundsByJudge,
}