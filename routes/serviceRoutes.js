const express = require('express')
const router = express.Router();

const serviceController = require('../controllers/serviceController')

router.post('/createService/:id',serviceController.uploadPhoto1, serviceController.resizePhotoProject, serviceController.createService)
router.get('/getAllServices',serviceController.getAllServices)
router.get('/petBoarding',serviceController.getPetBoarding)
router.get('/petHotel',serviceController.getPetHotel)
router.get('/dogWalking',serviceController.getDogWalking)
router.get('/grooming',serviceController.getGrooming)
router.get('/petTaxi',serviceController.getPetTaxi)
router.get('/dogTraining',serviceController.getDogTraining)



module.exports= router