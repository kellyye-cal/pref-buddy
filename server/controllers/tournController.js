const tournService = require('../services/tournService')
const fs = require("fs")
const path = require("path")
const validator = require('validator');
const {client} = require('../services/utils');

/**
 * 
 * @param {Object} req - request object from GET /api/tournaments/mytournaments
 * @param {Object} res - response object
 * @returns - in res.data, a list of tournaments attended by user with u_id
 */
const getMyTournaments = async(req, res) => {
    const u_id = req.id;
    const cacheKey = `tournaments:myTournaments:${u_id}`

    try {
        const cachedTournaments = await client.get(cacheKey);
        if (cachedTournaments) {
            return res.json(JSON.parse(cachedTournaments))
        };

        const myTournaments = await tournService.getMyTournaments({id: u_id})
        await client.set(cacheKey, JSON.stringify(myTournaments), {EX: 24 * 60 * 60});
        return res.json(myTournaments)

    } catch (error) {
        console.error(error);
        return (res.status(500).json({error: `Error getting tournaments for user ${u_id}: `, error}))
    }
}

const getMyJudgingTourns = async(req, res) => {
    const id = req.id;
    const cacheKey = `tournaments:myJudgingAt:${id}`;

    try {
        const cachedTournaments = await client.get(cacheKey);
        if (cachedTournaments) {return res.json(JSON.parse(cachedTournaments))};

        const myTournaments = await tournService.getMyJudging({id})
        await client.set(cacheKey, JSON.stringify(myTournaments), {EX: 24 * 60 * 60})
        return res.json(myTournaments)
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: `Error getting tournaments for user ${id}: `, error});
    }
}

const getAllTournaments = async(req, res) => {
    const u_id = req.id;

    const tournaments = await tournService.getAllTournaments({u_id})
    return res.json(tournaments)
}

const getTournamentById = async (req, res) => {
    const t_id = req.params.id;
    const u_id = req.id

    if (!validator.isNumeric(t_id)) {
        return res.status(400).json({ error: "Invalid tournament ID" });
    }

    try {
        const cacheKey = `tournaments:${t_id}:${u_id}`;

        const cachedTournament = await client.get(cacheKey);

        if (cachedTournament) {
            const {attending, judging} = JSON.parse(cachedTournament);
            return res.json({attending, judging});
        }

        var attending = await tournService.getTournamentById({t_id})
        const numRated = await tournService.getNumRated({t_id, u_id})
        const numTotal = await tournService.getNumJudges({t_id})

        attending.prefData = {numRated, numTotal}

        var judging = await tournService.getTournamentByIdJudging({t_id, j_id: u_id});

        await client.set(cacheKey, JSON.stringify({attending, judging}), {EX: 2 * 60 * 60});
        res.json({attending, judging})
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: `Error getting tournament ${t_id}: `, error});
    }
}

const getJudgesAtTourn = async (req, res) => {
    const t_id = req.params.id
    const u_id = req.query.u_id;

    if (!validator.isNumeric(t_id)) {
        return res.status(400).json({ error: "Invalid tournament ID" });
    }

    const cacheKey = `tournaments:${t_id}:${u_id}:judges`;

    try {
        const cachedJudges = await client.get(cacheKey);
        if (cachedJudges) {return res.json(JSON.parse(cachedJudges))};

        const judges = await tournService.getJudges({u_id, t_id});
        await client.set(cacheKey, JSON.stringify(judges), {EX: 6 * 60 * 60});
        return res.json(judges)
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: `Error getting judges for tournament ${t_id}: `, error});
    }
}

const scrapeTournament = async (req, res) => {
    const {u_id, url} = req.body

    try {
        const tourn_id = await tournService.scrapeTournament({url, u_id})
        return res.json({tourn_id})

    } catch (error) {
        return res.status(500).json({error: "Error processing the scraping request for tournment data"});
    }
}

const exportPrefsToCSV = async (req, res) => {
    const t_id = req.params.id
    const u_id = req.query.u_id;
    const filename = req.query.filename || "export.csv";

    if (!validator.isNumeric(t_id)) {
        return res.status(400).json({ error: "Invalid tournament ID" });
    }


    try {
        const result = await tournService.exportPrefsToCSV({t_id, u_id, filename})

        if (result.status === "success") {
            if (!fs.existsSync(result.fileName)) {
                return res.status(404).json({ error: "File not found" });
            }

            res.download(result.fileName, (err) => {
                if (err) {
                    console.error("Error downloading file:", err)
                    return res.status(500).json({error: "Error downloading file"})
                }

                fs.unlink(result.fileName, (err) => {
                    if (err) console.error("Error deleting file: ", err)
                })
            })
        } else {
            res.status(500).json({error: "Error exporting prefs to CV"})
        }
    } catch (error) {
        console.error("Export Error: ", error)
        return res.status(500).json({error: "Error exporting prefs to CSV"})
    }

}

const saveRoundType = async(req, res) => {
    const {t_id, round, j_id, type} = req.body;

    try {
        await tournService.saveRoundType({t_id, round, j_id, type});

        await client.del(`public:tournaments:${t_id}`);
        await client.del(`public:judges:${j_id}`);
        
        const getJudgeByIdKeys = await client.keys(`judges:${j_id}:*`);
        if (getJudgeByIdKeys.length > 0) {await client.del(...getJudgeByIdKeys)};

        await client.del(`judges:${j_id}:rounds`);

        return res.status(200).json({type})
    } catch (err) {
        console.error(err)
        return res.status(500).json({error: `Error getting round ${round} at ${t_id} for judge ${j_id}: `, err})
    }
}

module.exports = {
    getMyTournaments,
    getAllTournaments,
    getTournamentById,
    getJudgesAtTourn,
    scrapeTournament,
    exportPrefsToCSV,
    saveRoundType,
    getMyJudgingTourns,
}