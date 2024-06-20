const express = require('express')
const router = express.Router();

const cartController = require('../controllers/cartControllers')
const authController = require("../controllers/authController")

router.use(authController.protect)

router.patch('/addproduct',cartController.addProductToCart)
router.get('/getcart',cartController.getCart)
router.delete('/deletecart',cartController.clearCart)

router.patch("/plusquantity",cartController.updateCartItemPlus)
router.patch("/minusquantity",cartController.updateCartItemMinus)

router.delete('/removeproduct',cartController.removeItemFromCart)

router.patch('/applycoupon', cartController.applyCoupon)

module.exports = router
