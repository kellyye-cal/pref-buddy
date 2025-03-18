const publicService = require('../services/publicService');
const judgeServices = require('../services/judgeServices')

const getAllTournaments = async(req, res) => {
    try {
        const tournaments = await publicService.getAllTournaments();
        for (let i = 0; i < tournaments.length; i++) {
            const [result] = await publicService.getRoundsSpecified(tournaments[i].id);
            tournaments[i].roundsSpecified = result;
        }
        return res.json(tournaments)
    } catch (error) {
        console.error(error)
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
        return res.status(500).json({error: "Error fetching data for tournament: ", error})
    }
}

const searchJudges = async(req, res) => {
    const searchTerm = req.body.searchTerm

    try {
        const judges = await publicService.searchJudges(searchTerm);
        return res.json(judges);
    } catch (error) {
        console.error(error)
        return res.status(500).json({error: "Error searching for judges: ", error})
    }
}

const getJudgeById = async(req, res) => {
    const id = req.params.id;

    try {
        const judgeInfo = await publicService.getJudgeById(id)
        const rounds = await judgeServices.getRoundsByJudge({j_id: id})
        const stats = await judgeServices.getJudgeStats({j_id: id})
        const avgSpeaks = await judgeServices.getSpeaksById({j_id: id})
        stats.avgSpeaks = avgSpeaks;
        return res.json({judgeInfo, rounds, stats, avgSpeaks})
    } catch(error) {
        console.error(error)
        return res.status(500).json({error: "Error getting judge information: ", error})
    }
}

module.exports = {
    getAllTournaments,
    getTournamentById,
    searchJudges,
    getJudgeById,
};