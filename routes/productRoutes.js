const express = require('express')
const router = express.Router();

const productController = require('../controllers/productController')

router.post('/createproduct',productController.uploadPhoto,productController.resizePhotoProject,productController.createOne)
router.get('/getallproduct',productController.getAll)
router.delete('/',productController.deleteAll)

router.get("/getproduct/:id",productController.getOne)
router.get("/getproduct",productController.getProductBySearch)
router.patch("/:id",productController.uploadPhoto,productController.resizePhotoProject,productController.updateOne)
router.delete('/:id',productController.deleteOne)


module.exports = router
