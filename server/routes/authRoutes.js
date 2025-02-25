const express = require('express')
const router = express.Router();
const authController = require('../controllers/authController');
const verifyJWT = require('../../middleware/verifyJWT')

router.post('/register', authController.registerUser);
router.post('/create', verifyJWT, authController.createUser)
router.post('/login', authController.loginUser);
router.post('/refresh', authController.refresh)
router.post('/logout', verifyJWT, authController.logout)


module.exports = router;