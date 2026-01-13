const express = require('express');
const router = express.Router();
const { registerNewUser } = require('../../controllers/registerController');

router.post('/', registerNewUser);


module.exports = router;