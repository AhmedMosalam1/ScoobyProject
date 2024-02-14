const express = require('express')
const router = express.Router();
const passport = require("passport")

const authController = require('../controllers/authController')

router.post('/signup',authController.signup)
router.get('/login',authController.login)
router.get('/logout',authController.logout)
router.post("/forgotPassword",authController.sendforgotpasslink)
router.post('/reset-password/:userId/:token',authController.getresetpass)

router.get('/google', passport.authenticate('google', {scope: ['profile'],}));
router.get('/oauth2/google/redirect', passport.authenticate('google'),);

router.get('/facebook', passport.authenticate('facebook', { scope : 'email' }));
router.get('/facebook/callback',passport.authenticate('facebook'));

module.exports = router