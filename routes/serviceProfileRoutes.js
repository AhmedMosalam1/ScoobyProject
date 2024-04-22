const express = require('express')
//const {createPlog}=require('../controllers/plogContrller')
const serviceProfileController = require('../controllers/serviceProfileController')
const router = express.Router();

router.post('/add-serviceProfile',serviceProfileController.serviceProfileImages,serviceProfileController.createserviceProfile)
// router.patch('/update-doctor/:id',doctorController.doctorImages,doctorController.updatedoctor)
 router.get('/get-serviceProfile/:id',serviceProfileController.getServiceProfile)
router.get('/get-servicesProfile',serviceProfileController.getServicesProfile)

module.exports = router

