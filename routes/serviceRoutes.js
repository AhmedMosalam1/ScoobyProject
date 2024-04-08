const express = require('express')
const router = express.Router();

const serviceController = require('../controllers/serviceController')

router.post('/createService/:id',serviceController.uploadPhoto1, serviceController.resizePhotoProject, serviceController.createService)
router.get('/getAllServices',serviceController.getAllServices)
router.get('/getService',serviceController.getService)

module.exports= router