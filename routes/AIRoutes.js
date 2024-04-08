const express = require('express')
const router = express.Router();
const missingController = require('../AI/missing')
const chatbotController = require('../AI/chatPot')


router.get('/missing',missingController.missing)
router.get('/chatbot',chatbotController.chatBot)


module.exports = router