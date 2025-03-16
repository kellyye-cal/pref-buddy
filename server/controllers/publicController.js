const publicService = require('../services/publicService');

const getAllTournaments = async(req, res) => {
    try {
        const tournaments = await publicService.getAllTournaments();
        return res.json(tournaments)
    } catch (error) {
        return res.status(500).json({error: "Error fetching all tournaments"});
    }
}

const getTournamentById = async(req, res) => {
    const id = req.params.id;
    try {
        const rounds = await publicService.getRoundsByTournId(id);

        const tournamentInfo = await publicService.getTournamentById(id);
        return res.json({info: tournamentInfo, rounds})
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Error fetching data for tournament: ", error})
    }
}

module.exports = {
    getAllTournaments,
    getTournamentById,
};