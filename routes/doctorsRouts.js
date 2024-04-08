const express = require('express')
//const {createPlog}=require('../controllers/plogContrller')
const doctorController = require('../controllers/doctorController')
const router = express.Router();

router.post('/add-doctor',doctorController.uploadPhoto,doctorController.resizePhotoProject,doctorController.createdoctor)
router.get('/getdoctors',doctorController.getdoctors)

module.exports = router

