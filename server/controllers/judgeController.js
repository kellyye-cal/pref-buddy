const judgeServices = require('../services/judgeServices')
const validator = require('validator');
const {client} = require('../services/utils')


const getJudgeById = async(req, res) => {
    const j_id = req.params.id;
    const u_id = req.query.u_id;

    if (!validator.isNumeric(j_id)) {
        return res.status(400).json({ error: "Invalid tournament ID" });
    }

    const cacheKey = `judges:${j_id}:${u_id}`

    var judgeInfo;
    var paradigm = ""
    var avg_speaks;
    var stats;

    try {
        const cachedJudge = await client.get(cacheKey);

        if (cachedJudge) {
            const {judgeInfo, paradigm, avg_speaks, stats} = JSON.parse(cachedJudge)
            return res.json({judgeInfo, paradigm, avg_speaks, stats})
        }
    } catch (error) {
        console.error(error);
    }

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

    await client.set(cacheKey, JSON.stringify({judgeInfo, paradigm, avg_speaks, stats}), {EX: 6 * 60 * 60})
    return res.json({judgeInfo, paradigm, avg_speaks, stats})

}

const getAllJudges = async(req, res) => {
    const u_id = req.query.u_id;

    const cacheKey = `judges:all:${u_id}`;

    try {
        const cachedJudges = await client.get(cacheKey);

        if (cachedJudges) {return res.json(JSON.parse(cachedJudges))};

        const result = await judgeServices.getAllJudges({u_id})

        await client.set(cacheKey, JSON.stringify(result.judges), {EX: 6 * 60 * 60});
        return res.json(result.judges)

    } catch (error) {
        res.status(500).json({message: "Error getting all judges", error})
    }
}

const setRating = async(req, res) => {
    // affects allJudges, getJudgeById, 
    const {u_id, j_id, rating} = req.body;

    const allJudgesCacheKey = `judges:all:${u_id}`;
    const getJudgeByIdCacheKey = `judges:${j_id}:${u_id}`;

    try {       
        await judgeServices.updateRating({u_id, j_id, rating});
        res.sendStatus(200)
    } catch (error) {
        res.status(500).json({message: "Error updating rating", error})

    }
}

const getNotes = async(req, res) => {
    const {u_id, j_id} = req.query;    
    const cacheKey = `judges:notes:${j_id}:${u_id}`;

    try {
        const cachedNotes = await client.get(cacheKey);
        if (cachedNotes) {return res.json(JSON.parse(cachedNotes))};

        const result = await judgeServices.getNotes({u_id, j_id});

        await client.set(cacheKey, JSON.stringify({notes: result.notes}), {EX: 1 * 60 * 60});
        return res.json({notes: result.notes})
    } catch (error) {
        res.status(500).json({message: "Error fetching notes", error})
    }
}

const saveNote = async(req, res) => {
    const {u_id, j_id, note} = req.body;
    const cacheKey = `judges:notes:${j_id}:${u_id}`;

    try {
        await judgeServices.saveNote({u_id, j_id, note})
        await client.set(cacheKey, JSON.stringify({notes: note}), {EX: 1 * 60 * 60});
        res.sendStatus(204)
    } catch (error) {
        res.status(500).json({message: "Error updating rating", error})
    }
}

const getRoundsByJudge = async(req, res) => {
    const j_id = req.params.id;

    const cacheKey = `judges:${j_id}:rounds`;

    try {
        const cachedRounds = await client.get(cacheKey);
        if (cachedRounds) {return res.json(JSON.parse(cachedRounds))}

        const rounds = await judgeServices.getRoundsByJudge({j_id});

        await client.set(cacheKey, JSON.stringify(rounds), {EX: 24 * 60 * 60});
        return res.json(rounds)
    } catch (error) {
        res.status(500).json({message: `Error getting rounds for judge ${j_id}: `, error})
    }
}

const getUpcomingTournaments = async(req, res) => {
    const j_id = req.params.id;

    const cacheKey = `judges:${j_id}:upcomingTournaments`;

    try {
        const cachedTournaments = await client.get(cacheKey);

        if (cachedTournaments) {return res.json(JSON.parse(cachedTournaments))};

        const tournaments = await judgeServices.getUpcomingTournaments({j_id});

        await client.set(cacheKey, JSON.stringify(tournaments), {EX: 6 * 60 * 60});
        return res.json(tournaments)
    } catch (err) {
        console.error(err)

        return res.status(500).json({message: `Error getting upcoming tournaments for judge ${j_id}: `, err})
    }
}

module.exports = {
    getJudgeById,
    getAllJudges,
    setRating,
    getNotes,
    saveNote,
    getRoundsByJudge,
    getUpcomingTournaments
}