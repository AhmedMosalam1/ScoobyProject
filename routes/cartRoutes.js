const express = require('express')
const router = express.Router();

const cartController = require('../controllers/cartControllers')

router.post('/addproduct/:id',cartController.addProductToCart)
router.get('/getcart/:id',cartController.getCart)
router.delete('/deletecart/:id',cartController.clearCart)

router.patch("/updatecart/:id",cartController.updateCartItem)
router.delete('/removeproduct/:id',cartController.removeItemFromCart)

router.patch('/applycoupon/:id', cartController.applyCoupon)

module.exports = router