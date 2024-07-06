const catchAsync = require('express-async-handler');
const appError = require('../utils/appError');
const stripe = require("stripe")(process.env.STRIPE_SECRET)

const User = require('../Models/userModel');
const Product = require('../Models/productsModel');
const Cart = require('../Models/cartModel');
const Order = require('../Models/orderModel');

exports.createCashOrder = catchAsync(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;

  const cart = await Cart.findById(req.query.cartId);
  if (!cart) {
    return next(
      new appError(`There is no such cart with id ${req.query.cartId}`, 404)
    );
  }

  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  const order = await Order.create({
    user: req.user.id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });

  await Cart.findByIdAndDelete(req.query.cartId);
  res.status(201).json({ status: 'success', data: order });
});


exports.getAllOrders = catchAsync(async (req, res) => {

  const documents = await Order.find();

  res
    .status(200)
    .json({ results: documents.length, data: documents });
});

exports.getAllOwnOrders = catchAsync(async (req, res) => {
  const id = req.user.id

  const documents = await Order.find({ user: id });

  res
    .status(200)
    .json({ results: documents.length, data: documents });
});

exports.getOneOrder = catchAsync(async (req, res, next) => {
  const id = req.query.orderId
  let doc = await Order.findById(id)

  if (!doc) {
    return next(new appError(`Can't find Order on this id`, 404));
  }

  res.status(201).json({
    status: "success",
    results: doc.length,
    data: {
      data: doc
    }
  })
})


exports.updateOrderToDeliveredAndPaid = catchAsync(async (req, res, next) => {

  const order = await Order.findById(req.query.orderId);

  if (!order) {
    return next(new appError(`Can't find Order on this id`, 404));
  }


  order.isPaidAndDelivered = true;
  order.paidAndDeliveredAt = Date.now();


  const updatedOrder = await order.save();

  res.status(200).json({ status: 'success', data: updatedOrder });
});


exports.checkoutSession = catchAsync(async (req, res, next) => {

  const taxPrice = 0;
  const shippingPrice = 0;


  const cart = await Cart.findById(req.query.cartId).populate('user', 'name email');
  if (!cart) {
    return next(
      new appError(`There is no such cart with id ${req.query.cartId}`, 404)
    );
  }


  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;


  const session = await stripe.checkout.sessions.create({
    line_items: [{
      price_data: {
        unit_amount: totalOrderPrice * 100,
        currency: 'egp',
        product_data: {
          name: `Total Order Is:`,//cart.user.name,
          images: [
            `https://i.postimg.cc/63wdfkxP/22-1.png`,
          ],
        },
      },

      quantity: 1,//for one amount item
    }],
    mode: 'payment',
    success_url: `http://localhost:4200/home`,
    cancel_url: `${req.protocol}://${req.get('host')}/cart`,
    customer_email: cart.user.email,
    client_reference_id: req.query.cartId,
    metadata: req.body.shippingAddress,
  });

  res.status(200).json({ status: 'success', session });

});



const createCardOrder = async (session) => {
  try {
    const cartId = session.client_reference_id;
    const totalPrice = session.amount_total / 100;
    const cart = await Cart.findById(cartId);
    const user = await User.findOne({ email: session.customer_email });
    //console.log(user);
   // console.log(cart);

    const order = await Order.create({
      user: user._id,
      cartItems: cart.cartItems,
      totalOrderPrice: totalPrice,
      paymentMethod: "card",
      isPaidAndDelivered: true,
      paidAndDeliveredAt: Date.now(),
      shippingAddress: session.metadata
    });

    // if (order) {
    //   const bulkOptions = cart.cartItems.map((item) => ({
    //     updateOne: {
    //       filter: { _id: item.product },
    //       update: { $inc: { quantity: -item.quantity } },
    //     },
    //   }));
    //   await Product.bulkWrite(bulkOptions, {});
    // }

    await Cart.findByIdAndDelete(cartId);
  } catch (error) {
    console.log(error);
  }
};



exports.webhookCheckout = catchAsync(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

  } catch (err) {

    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {

    await createCardOrder(event.data.object);
  }
  res.status(200).json({ recived: true });
});
