const judgeServices = require('../services/judgeServices')

const getJudgeById = async(req, res) => {

    const j_id = req.params.id;
    const u_id = req.query.u_id;

    var judgeInfo;
    var paradigm = "No paradigm found."

    try {
        judgeInfo = await judgeServices.getJudgeById({j_id, u_id});
    } catch (error) {
        res.status(500).json({message: "Error getting judge information", error})
    }

    try {
        paradigm = await judgeServices.getParadigm({j_id});
    } catch (error) {
        console.log(error)
    }

    return res.json({judgeInfo, paradigm})

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
        return res.json(result.notes)
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

module.exports = {
    getJudgeById,
    getAllJudges,
    setRating,
    getNotes,
    saveNote,
}