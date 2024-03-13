const express = require('express')
const router = express.Router();

const offerController = require('../controllers/offerController')

router.post('/createoffer',offerController.uploadPhoto,offerController.resizePhotoProject,offerController.createOne)
router.get('/getalloffer',offerController.getAll)
router.delete('/',offerController.deleteAll)

router.get("/getoffer/:id",offerController.getOne)
router.patch("/:id",offerController.uploadPhoto,offerController.resizePhotoProject,offerController.updateOne)
router.delete('/:id',offerController.deleteOne)


module.exports = router