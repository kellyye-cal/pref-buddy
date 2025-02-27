const express = require('express')
const router = express.Router();
const judgeController = require('../controllers/judgeController');
const verifyJWT = require('../../middleware/verifyJWT');
const { verify } = require('jsonwebtoken');

router.get('/all-judges', verifyJWT, judgeController.getAllJudges);
router.post('/set_rating', verifyJWT, judgeController.setRating);
router.get('/get_notes', verifyJWT, judgeController.getNotes);
router.post('/save_note', verifyJWT, judgeController.saveNote);
router.get('/:id', verifyJWT, judgeController.getJudgeById);


module.exports = router;