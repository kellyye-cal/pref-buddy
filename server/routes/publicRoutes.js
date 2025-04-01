const express = require('express')
const router = express.Router();
const publicController = require('../controllers/publicController');

router.get('/alltournaments', publicController.getAllTournaments);
router.get('/tournaments/:id', publicController.getTournamentById);
router.post('/search_judges', publicController.searchJudges)
router.get('/judges/:id', publicController.getJudgeById);
router.get('/community_stats', publicController.getCommunitySpeaks);
router.get('/judges/speaks/:id', publicController.getSpeaksByJudgeId)


module.exports = router;