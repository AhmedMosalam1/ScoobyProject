const express = require('express')
//const {createPlog}=require('../controllers/plogContrller')
const plogContrller = require('../controllers/plogContrller')
const router = express.Router();

router.post('/createplog',plogContrller.uploadPhoto,plogContrller.resizePhotoProject,plogContrller.createPlog)
router.get('/getallplogs',plogContrller.getplogs)

module.exports = router

