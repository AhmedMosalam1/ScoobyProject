const express = require('express')
const router = express.Router();

const orderController = require('../controllers/orderControllers')
const authController = require("../controllers/authController")

router.use(authController.protect)

router.get('/getallorder',orderController.getAllOrders)
router.get('/getallownorder',orderController.getAllOwnOrders)
router.get('/getoneorder',orderController.getOneOrder)
router.post('/cashorder',orderController.createCashOrder)

router.patch("/updateorder",orderController.updateOrderToDeliveredAndPaid)


router.get("/checkout-session",orderController.checkoutSession)

module.exports = router