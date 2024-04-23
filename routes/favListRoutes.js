const express = require('express')
const router = express.Router();
const favController = require('../controllers/favControllers')


router.get('/getfavproduct/:id',favController.getFavProduct)
router.get('/getfavpet/:id',favController.getFavPet)
router.patch("/addfav/:id",favController.addFav)


module.exports = router
