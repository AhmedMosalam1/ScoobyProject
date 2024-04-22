const express = require('express')
const router = express.Router();

const requestController = require('../controllers/requestController')

router.post('/addRequest/:id',requestController.addRequest)
router.get('/upcomingBooking/:id',requestController.upcomingBooking)
router.get('/pastBooking/:id',requestController.pastBooking)

module.exports= router