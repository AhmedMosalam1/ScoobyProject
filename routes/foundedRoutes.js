const express = require('express')
//const {createPlog}=require('../controllers/plogContrller')
const foundedControlller= require('../controllers/foundedController')
const router = express.Router();

router.post('/IfoundPet/:id',foundedControlller.uploadPhoto,foundedControlller.resizePhotoProject,foundedControlller.setUserIds,foundedControlller.foundedPets)
router.get('/getallfoundedPets',foundedControlller.getallFounded)

module.exports = router

