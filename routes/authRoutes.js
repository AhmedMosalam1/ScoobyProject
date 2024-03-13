const express = require('express')
const router = express.Router();
const passport = require("passport")

const authController = require('../controllers/authController')

router.post('/signup',authController.signup)
router.post('/login',authController.login)
router.get('/logout',authController.logout)
router.post("/forgotPassword",authController.sendforgotpasscode)
router.post("/checkCode",authController.checkforgotpasscode)
router.post('/reset-password/:userId',authController.getresetpass)
router.get('/getuser/:id',authController.getuser)


router.get('/google', passport.authenticate('google', {scope: ['profile'],}));
router.get('/auth/google/redirect', passport.authenticate('google'),);

router.get('/facebook', passport.authenticate('facebook', { scope : 'email' }));
router.get('/auth/facebook/callback',passport.authenticate('facebook'));

module.exports = router