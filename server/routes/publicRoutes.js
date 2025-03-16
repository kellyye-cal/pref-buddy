const express = require('express')
const router = express.Router();
const publicController = require('../controllers/publicController');

router.get('/alltournaments', publicController.getAllTournaments);
router.get('/tournaments/:id', publicController.getTournamentById);


module.exports = router;