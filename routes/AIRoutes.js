const express = require('express')
const router = express.Router();
const passport = require("passport")
const missingController = require('../AI/missing')

router.get('/missing',missingController.missing)

module.exports = router