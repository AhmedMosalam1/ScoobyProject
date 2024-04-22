const express = require('express')
const router = express.Router();
const favController = require('../controllers/favControllers')


router.get('/getfav/:id',favController.getFav)
router.post("/addfav/:id",favController.addFav)


module.exports = router