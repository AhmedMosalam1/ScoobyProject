const express = require('express')
//const {createPlog}=require('../controllers/plogContrller')
const authController=require('../controllers/authController')
const foundedControlller= require('../controllers/foundedController')
const router = express.Router();

router.use(authController.protect)
router.post('/IfoundPet',foundedControlller.uploadPhoto,foundedControlller.resizePhotoProjectDraft,foundedControlller.resizePhotoProjectCatOrDog,foundedControlller.setUserIds,foundedControlller.foundedPets)
router.get('/getallfoundedPets',foundedControlller.getallFounded)
router.get('/getCats',foundedControlller.getcats)
router.get('/getDogs',foundedControlller.getdogs)
router.get('/getRecentlyAdded',foundedControlller.getRecentlyAddedPets)

module.exports = router

