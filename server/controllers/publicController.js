const publicService = require('../services/publicService');
const judgeServices = require('../services/judgeServices');
const {client} = require('../services/utils')

/**
 * GET /api/public/alltournaments
 * Gets all tournaments in the database
 * with stats on how many rounds have been specified for that tournament.
 * @param {Object} req - The request object
 * @param {Object} res  - The response object used to send the result back to the client
 * @returns {Object} JSON response with data being a list of JSON objects representing each tournament
 */
const getAllTournaments = async(req, res) => {
    const cacheKey = "public:all_tournaments";

    try {
        const cachedTournaments = await client.get(cacheKey)
        if (cachedTournaments) {return res.json(JSON.parse(cachedTournaments))}

        const tournaments = await publicService.getAllTournaments();
        for (let i = 0; i < tournaments.length; i++) {
            const [result] = await publicService.getRoundsSpecified(tournaments[i].id);
            tournaments[i].roundsSpecified = result;
        }

        await client.set(cacheKey, JSON.stringify(tournaments), {EX: 6 * 60 * 60});
        return res.json(tournaments)
    } catch (error) {
        console.error(error)
        return res.status(500).json({error: "Error fetching all tournaments"});
    }
}

/**
 * Function to get tournament data by ID
 * @param {Object} req - The request object, with parameter id to specify the tournament to fetch by id. 
 * @param {Object} res - The response object used to send tournament data back to the client.
 * @returns {Object} The JSON response with data containing {rounds, info}. Rounds is a list of JSON object
 *                   representing rounds at the tournament. Info contins information about the tournament (name, date, link).
 */
const getTournamentById = async(req, res) => {
    const id = req.params.id;
    const cacheKey = `public:tournaments:${id}`;

    try {
        const cachedTournaments = await client.get(cacheKey);
        if (cachedTournaments) {
            const {info, rounds} = JSON.parse(cachedTournaments)
            return res.json({info, rounds})
        }

        const rounds = await publicService.getRoundsByTournId(id);
        const tournamentInfo = await publicService.getTournamentById(id);

        await client.set(cacheKey, JSON.stringify({info: tournamentInfo, rounds}), {EX: 6 * 60 * 60});

        return res.json({info: tournamentInfo, rounds})
    } catch (error) {
        console.error(error)
        return res.status(500).json({error: "Error fetching data for tournament: ", error})
    }
}


const searchJudges = async(req, res) => {
    const searchTerm = req.body.searchTerm
    const cacheKey = `public:search_judges:${searchTerm}`;

    try {
        const cachedResults = await client.get(cacheKey)
        if (cachedResults) {return res.json(JSON.parse(cachedResults))};

        const judges = await publicService.searchJudges(searchTerm);

        await client.set(cacheKey, JSON.stringify(judges), {EX: 6 * 60 * 60});
        return res.json(judges);
    } catch (error) {
        console.error(error)
        return res.status(500).json({error: "Error searching for judges: ", error})
    }
}

const getJudgeById = async(req, res) => {
    const id = req.params.id;
    const cacheKey = `public:judges:${id}`

    try {
        const cachedJudge = await client.get(cacheKey);
        if (cachedJudge) {
            const {judgeInfo, rounds, stats, avgSpeaks} = JSON.parse(cachedJudge)
            return res.json({judgeInfo, rounds, stats, avgSpeaks})
        }


        const judgeInfo = await publicService.getJudgeById(id)
        const rounds = await judgeServices.getRoundsByJudge({j_id: id})
        const stats = await judgeServices.getJudgeStats({j_id: id})
        const speaksStats = await judgeServices.getSpeaksById({j_id: id})
        stats["avgSpeaks"] = speaksStats.avg;
        stats["speaksSD"] = speaksStats.sd;

        await client.set(cacheKey, JSON.stringify({judgeInfo, rounds, stats, avgSpeaks: speaksStats.avg}), {EX: 60 * 60});
        return res.json({judgeInfo, rounds, stats, avgSpeaks: speaksStats.avg})
    } catch(error) {
        console.error(error)
        return res.status(500).json({error: "Error getting judge information: ", error})
    }
}

const getCommunitySpeaks = async(req, res) => {
    const cacheKey = "public:community_speaks";

    try {
        const cachedStats = await client.get(cacheKey)

        if (cachedStats) {return res.json(JSON.parse(cachedStats))}
        
        const stats = await publicService.getCommunitySpeaks();

        await client.set(cacheKey, JSON.stringify(stats), {EX: 86400});

        return res.json(stats)

    } catch (error) {
        console.error(error)
        return res.status(500).json({error: "Error getting community stats"})
    }
}

const getSpeaksByJudgeId = async(req, res) => {
    const id = req.params.id;
    const cacheKey = `public:judges:speaks:${id}`;

    try {
        const cachedStats = await client.get(cacheKey)

        if (cachedStats) {return res.json(JSON.parse(cachedStats))}
        
        const stats = await judgeServices.getSpeaksById({j_id: id});

        await client.set(cacheKey, JSON.stringify(stats), {EX: 86400});

        return res.json(stats)

    } catch (error) {
        console.error(error)
        return res.status(500).json({error: "Error getting community stats"})
    }
}

module.exports = {
    getAllTournaments,
    getTournamentById,
    searchJudges,
    getJudgeById,
    getCommunitySpeaks,
    getSpeaksByJudgeId
};