const express = require('express')
const router = express.Router();

const serviceController = require('../controllers/serviceController')

router.post('/createService/:id',serviceController.uploadPhoto, serviceController.resizePhotoProject, serviceController.createService)
router.get('/getAllServices',serviceController.getAllServices)


module.exports= router