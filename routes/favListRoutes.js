const express = require('express')
const router = express.Router();
const favController = require('../controllers/favControllers')
const authController = require("../controllers/authController")

router.use(authController.protect)

router.get('/getfavproduct',favController.getFavProduct)
router.get('/getfavpet',favController.getFavPet)
router.patch("/addfav",favController.addFav)


module.exports = router
