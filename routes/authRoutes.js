const express = require('express')
const router = express.Router();
const passport = require("passport")

const authController = require('../controllers/authController')

router.post('/signup',authController.signup)
router.get('/login',authController.login)

router.get('/google', passport.authenticate('google', {
    scope: ['profile'],
}));

// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get('/google/redirect', passport.authenticate('google'),);

module.exports = router