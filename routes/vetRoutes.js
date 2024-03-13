const express = require('express')
const router = express.Router();

const vetController = require('../controllers/vetControllers')

router.post('/createvet',vetController.uploadPhoto,vetController.resizePhotoProject,vetController.createOne)
router.get('/getallvet',vetController.getAll)
router.delete('/',vetController.deleteAll)

router.get("/getvet/:id",vetController.getOne)
router.patch("/:id",vetController.updateOne)
router.delete('/:id',vetController.deleteOne)


module.exports = router