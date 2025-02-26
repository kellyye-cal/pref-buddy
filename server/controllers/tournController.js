const tournService = require('../services/tournService')

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


    const tournament = await tournService.getTournamentById({t_id})

    const numRated = await tournService.getNumRated({t_id, u_id})
    const numTotal = await tournService.getNumJudges({t_id})

    res.json({numRated, numTotal, tournament})
}

const getJudgesAtTourn = async (req, res) => {
    const t_id = req.params.id
    const u_id = req.query.u_id;

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

module.exports = {
    getMyTournaments,
    getAllTournaments,
    getTournamentById,
    getJudgesAtTourn,
    scrapeTournament,
}