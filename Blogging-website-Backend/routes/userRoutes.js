
const express = require('express');

const router = express.Router();
const userController = require('../controllers/usersController');
//authentication
// /api/users/login


// /api/users

router.post('/users', userController.registerUser )

module.exports = router;