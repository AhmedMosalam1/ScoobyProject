const express = require('express')
const user=require('../Models/userModel')
//const {createPlog}=require('../controllers/plogContrller')
const petContrller = require('../controllers/petsController')
const authcontroller=require('../controllers/authController')
const router = express.Router();
//router.post('/createplog',plogContrller.uploadPhoto,plogContrller.resizePhotoProject,plogContrller.createPlog)

router.post('/addpet',petContrller.uploadPhoto,petContrller.resizePhotoProject,petContrller.setUserIds,petContrller.addpet)

router.get('/getallpets',petContrller.getpets)
router.get('/getmypets/:id',petContrller.setUserIds,petContrller.getmypets)

module.exports = router


