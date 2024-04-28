const express = require('express')
const router = express.Router();

const orderController = require('../controllers/orderControllers')

router.get('/getallorder',orderController.getAllOrders)
router.get('/getallownorder/:id',orderController.getAllOwnOrders)
router.get('/getoneorder',orderController.getOneOrder)
router.post('/cashorder/:id',orderController.createCashOrder)

router.patch("/updateorder/:id",orderController.updateOrderToDeliveredAndPaid)


router.get("/checkout-session/:id",orderController.checkoutSession)

module.exports = router