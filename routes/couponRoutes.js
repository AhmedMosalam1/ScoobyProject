const express = require('express')
const router = express.Router();

const couponController = require('../controllers/couponControllers')

router.post('/createcoupon',couponController.createOne)
router.get('/getallcoupon',couponController.getAll)
router.delete('/',couponController.deleteAll)

router.get("/getcoupon/:id",couponController.getOne)
router.patch("/:id",couponController.updateOne)
router.delete('/:id',couponController.deleteOne)


module.exports = router