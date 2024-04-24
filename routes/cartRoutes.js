const express = require('express')
const router = express.Router();

const cartController = require('../controllers/cartControllers')

router.patch('/addproduct/:id',cartController.addProductToCart)
router.get('/getcart/:id',cartController.getCart)
router.delete('/deletecart/:id',cartController.clearCart)

router.patch("/plusquantity/:id",cartController.updateCartItemPlus)
router.patch("/minusquantity/:id",cartController.updateCartItemMinus)

router.delete('/removeproduct/:id',cartController.removeItemFromCart)

router.patch('/applycoupon/:id', cartController.applyCoupon)

module.exports = router
