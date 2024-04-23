const express = require('express')
//const {createPlog}=require('../controllers/plogContrller')
const doctorController = require('../controllers/doctorController')
const router = express.Router();

router.post('/add-doctor',doctorController.doctorImages,doctorController.createdoctor)
router.patch('/update-doctor/:id',doctorController.doctorImages,doctorController.updatedoctor)
router.get('/get-doctor/:id',doctorController.getDoctor)
router.get('/getdoctors',doctorController.getdoctors)

module.exports = router

