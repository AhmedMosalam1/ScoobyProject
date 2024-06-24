const express = require('express')
const router = express.Router();
const passport = require("passport")
const missingController = require('../AI/missing')
const chatbotController = require('../AI/chatPot')

router.post('/missing',missingController.uploadPhoto,missingController.resizePhotoProject,missingController.missing)
router.get('/chatbot',chatbotController.chatBot)

module.exports = router
