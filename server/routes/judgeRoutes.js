const express = require('express')
const router = express.Router();
const judgeController = require('../controllers/judgeController');
const verifyJWT = require('../../middleware/verifyJWT')

router.get('/all-judges', verifyJWT, judgeController.getAllJudges)
router.get('/:id', verifyJWT, judgeController.getJudgeById);
router.post('/set_rating', verifyJWT, judgeController.setRating)

module.exports = router;