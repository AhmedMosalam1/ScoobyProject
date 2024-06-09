const express = require('express')
const user=require('../Models/userModel')
//const {createPlog}=require('../controllers/plogContrller')
const petContrller = require('../controllers/petsController')
const authcontroller=require('../controllers/authController')
const router = express.Router();
//router.post('/createplog',plogContrller.uploadPhoto,plogContrller.resizePhotoProject,plogContrller.createPlog)

router.post('/addpet/:id',petContrller.uploadPhoto,petContrller.resizePhotoProject,petContrller.setUserIds,petContrller.addpettouser)
router.post('/addpet-shelter/:id',petContrller.uploadPhoto,petContrller.resizePhotoProject,petContrller.setshelterIds,petContrller.addpettoshelter)

router.post('/addpet',petContrller.uploadPhoto,petContrller.resizePhotoProject,petContrller.setUserIds,petContrller.addpet)
router.get('/get-top-collection',petContrller.filteradapt)
router.get('/getcats',petContrller.filtercats)
router.get('/getdogs',petContrller.filterdogs)
router.get('/adoptMe',petContrller.availableforadoption)
router.get('/filtertest',petContrller.filtertest)
router.get('/filterdogsforkids',petContrller.filterdogsforkids)
router.get('/filtercatsforkids',petContrller.filtercatsforkids)
router.get('/successfullyAdaped',petContrller.successAdapted)



router.get('/getallpets',petContrller.getpets)
router.get('/getmypets/:id',petContrller.getmypets)
router.patch('/updateMyPet/:id',petContrller.uploadPhoto,petContrller.resizePhotoProject,petContrller.updatepet)
router.delete('/deletePet/:id',petContrller.deletepet)


module.exports = router
