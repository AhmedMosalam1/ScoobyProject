const express = require('express')
const router = express.Router();

const requestController = require('../controllers/requestController')
const authController = require("../controllers/authController")

router.use(authController.protect)

router.post('/addRequest',requestController.addRequest)
router.get('/upcomingBooking',requestController.upcomingBooking)
router.get('/pastBooking',requestController.pastBooking)

module.exports= router