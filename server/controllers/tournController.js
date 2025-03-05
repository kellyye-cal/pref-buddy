const tournService = require('../services/tournService')
const fs = require("fs")
const path = require("path")
const validator = require('validator');

const getMyTournaments = async(req, res) => {
    const u_id = req.id;

    const myTournaments = await tournService.getMyTournaments({id: u_id})
    return res.json(myTournaments)
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


    const tournament = await tournService.getTournamentById({t_id})

    const numRated = await tournService.getNumRated({t_id, u_id})
    const numTotal = await tournService.getNumJudges({t_id})

    res.json({numRated, numTotal, tournament})
}

const getJudgesAtTourn = async (req, res) => {
    const t_id = req.params.id
    const u_id = req.query.u_id;

    if (!validator.isNumeric(t_id)) {
        return res.status(400).json({ error: "Invalid tournament ID" });
    }

    try {
        const judges = await tournService.getJudges({u_id, t_id})
        return res.json(judges)
    } catch (error) {

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
            if (!fs.existsSync(result.filePath)) {
                return res.status(404).json({ error: "File not found" });
            }

            res.download(result.filePath, filename, (err) => {
                if (err) {
                    console.error("Error downloading file:", err)
                    res.status(500).json({error: "Error downloading file"})
                }

                fs.unlink(result.filePath, (err) => {
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

module.exports = {
    getMyTournaments,
    getAllTournaments,
    getTournamentById,
    getJudgesAtTourn,
    scrapeTournament,
    exportPrefsToCSV,
}