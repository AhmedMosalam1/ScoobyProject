const express = require('express')
const user=require('../Models/userModel')
//const {createPlog}=require('../controllers/plogContrller')
const petContrller = require('../controllers/petsController')
const authcontroller=require('../controllers/authController')
const router = express.Router();

router.post('/addpet',authcontroller.protect,petContrller.setUserIds,petContrller.addpet)

router.get('/getallpets',petContrller.getpets)

module.exports = router


