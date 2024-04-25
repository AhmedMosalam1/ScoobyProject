const express = require('express')
//const {createPlog}=require('../controllers/plogContrller')
const foundedControlller= require('../controllers/foundedController')
const router = express.Router();

router.post('/IfoundPet/:id',foundedControlller.uploadPhoto,foundedControlller.resizePhotoProjectDraft,foundedControlller.resizePhotoProjectCatOrDog,foundedControlller.setUserIds,foundedControlller.foundedPets)
router.get('/getallfoundedPets',foundedControlller.getallFounded)
router.get('/getCats',foundedControlller.getcats)
router.get('/getDogs',foundedControlller.getdogs)
router.get('/getRecentlyAdded',foundedControlller.getRecentlyAddedPets)

module.exports = router

