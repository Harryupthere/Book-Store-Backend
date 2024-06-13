const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {authMiddleware,authorize} = require('../middlewares/authMiddleware');

router.post('/signup', userController.registerUser);
router.post('/login', userController.login);
router.get('/get-users',authMiddleware,authorize(["admin"]), userController.getUsers);

module.exports = router;