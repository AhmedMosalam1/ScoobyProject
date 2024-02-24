const express = require('express')
const router = express.Router();

const serviceController = require('../controllers/serviceController')

router.post('/createService', serviceController.createService)
router.get('/getAllServices',serviceController.getAllServices)

module.exports= router