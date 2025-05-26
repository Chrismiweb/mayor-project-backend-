const express = require('express');
const { registerUser, registerSeller } = require('../authentication/Auth');

const router = express.Router()

router.route('/registerUser').post(registerUser)
router.route('/registerSeller').post(registerSeller)



module.exports = router