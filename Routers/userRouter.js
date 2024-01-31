const authController = require('../Controllers/authControllers')
const express = require('express')

const app = express();
app.use(express.json());

const router = express.Router();
router.post('/signup',authController.signup)
router.get('/login',authController.login)

router.get("/forgotPassword",authController.getforgotpass)
router.post("/forgotPassword",authController.sendforgotpasslink)


router.get('/reset-password/:userId/:token',authController.getresetpassview)
router.post('/reset-password/:userId/:token',authController.getresetpass)
module.exports = router
