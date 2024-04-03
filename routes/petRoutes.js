const express = require('express')
const user=require('../Models/userModel')
//const {createPlog}=require('../controllers/plogContrller')
const petContrller = require('../controllers/petsController')
const authcontroller=require('../controllers/authController')
const router = express.Router();
//router.post('/createplog',plogContrller.uploadPhoto,plogContrller.resizePhotoProject,plogContrller.createPlog)

router.post('/addpet/:id',petContrller.uploadPhoto,petContrller.resizePhotoProject,petContrller.setUserIds,petContrller.addpettouser)
router.post('/addpet',petContrller.uploadPhoto,petContrller.resizePhotoProject,petContrller.setUserIds,petContrller.addpet)
router.get('/get-top-collection',petContrller.filteradapt)
router.get('/getcats',petContrller.filtercats)
router.get('/getdogs',petContrller.filterdogs)
router.get('/adoptMe',petContrller.availableforadoption)
router.get('/filtertest',petContrller.filtertest)

router.get('/getallpets',petContrller.getpets)
router.get('/getmypets/:id',petContrller.getmypets)
router.get('/missing',petContrller.missing)

module.exports = router