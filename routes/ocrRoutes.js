const express = require('express')
//const {createPlog}=require('../controllers/plogContrller')
const Ocr = require('../AI/ocr')
const router = express.Router();

router.post('/product/',Ocr.uploadPhoto,Ocr.resizePhotoProject,Ocr.ocr)

module.exports = router

