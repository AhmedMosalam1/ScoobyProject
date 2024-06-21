const express = require('express')
const router = express.Router();

const cartController = require('../controllers/cartControllers')
const authController = require("../controllers/authController")

//router.use(authController.protect)

router.patch('/addproduct/:id',cartController.addProductToCart)
router.get('/getcart/:id',cartController.getCart)
router.delete('/deletecart/:id',cartController.clearCart)

router.patch("/plusquantity/:id",cartController.updateCartItemPlus)
router.patch("/minusquantity/:id",cartController.updateCartItemMinus)

router.delete('/removeproduct/:id',cartController.removeItemFromCart)

router.patch('/applycoupon', cartController.applyCoupon)

module.exports = router
