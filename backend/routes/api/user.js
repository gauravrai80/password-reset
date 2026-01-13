const express = require('express');
const router = express.Router();
const { getUserInfo } = require('../../controllers/userController');
const verifyJWT = require('../../middleware/verifyJWT');

// Protected route - requires JWT token
router.get('/', verifyJWT, getUserInfo);

module.exports = router;
