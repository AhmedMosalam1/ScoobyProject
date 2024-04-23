const express = require('express')
const router = express.Router();
const favController = require('../controllers/favControllers')


router.get('/getfav/:id',favController.getFav)
router.patch("/addfav/:id",favController.addFav)


module.exports = router
