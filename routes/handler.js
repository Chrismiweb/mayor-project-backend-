const express = require('express');
const { registerUser, registerSeller, login } = require('../authentication/Auth');

const router = express.Router()

router.route('/registerUser').post(registerUser)
router.route('/registerSeller').post(registerSeller)
router.route('/login').post(login)




module.exports = router