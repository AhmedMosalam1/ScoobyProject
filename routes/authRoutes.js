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

router.get('/google', passport.authenticate('google', {scope: ['profile'],}));
router.get('/auth/google/redirect', passport.authenticate('google'), (req, res,next) => {
  if (req.user && req.user.token) {
    const token = req.user.token;
    console.log(req.user);
    const result = req.user.user
    res.status(200).json({
        status: "success",
        token,
        data: {
          result
        },
      });
  } 
  //next()
});
router.get('/facebook', passport.authenticate('facebook', { scope : 'email' }));
router.get('/auth/facebook/callback',passport.authenticate('facebook'));

module.exports = router
