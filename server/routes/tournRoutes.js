const express = require('express')
const router = express.Router();
const tournController = require('../controllers/tournController');
const verifyJWT = require('../../middleware/verifyJWT')

router.get('/mytournaments', verifyJWT, tournController.getMyTournaments)
router.get('/all', verifyJWT, tournController.getAllTournaments)
router.get('/:id', verifyJWT, tournController.getTournamentById)
router.get('/:id/judges', verifyJWT, tournController.getJudgesAtTourn)
router.get('/:id/judges/export_csv', verifyJWT, tournController.exportPrefsToCSV)
router.post('/scrape', verifyJWT, tournController.scrapeTournament)


module.exports = router;