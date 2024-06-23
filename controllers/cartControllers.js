const catchAsync = require('express-async-handler');
const appError = require('../utils/appError');

const Product = require('../Models/productsModel');
const Coupon = require('../Models/couponModel');
const Cart = require('../Models/cartModel')


exports.addProductToCart = catchAsync(async (req, res, next) => {
  const { productId } = req.query;
  const product = await Product.findById(productId);

  let cart = await Cart.findOne({ user: req.params.id });

  if (!cart) {
    cart = await Cart.create({
      user: req.params.id,
      cartItems: [{ product: productId, price: product.priceAfterDiscount }],
    });
  } else {
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex > -1) {
      cart.cartItems.splice(productIndex, 1);
    } else {
      cart.cartItems.push({ product: productId, price: product.priceAfterDiscount });
    }
  }

  cart.calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Product added to cart successfully',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});


exports.getCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.params.id }).populate('cartItems.product');

  if (!cart) {
    return next(
      new appError(`There is no cart for this user id : ${req.params.id}`, 404)
    );
  }

  const a = req.headers.authorization
        console.log(a);

  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

exports.removeItemFromCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.params.id },
    {
      $pull: { cartItems: { product: req.query.itemId } },
    },
    { new: true }
  );

  cart.calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});


exports.clearCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOneAndDelete({ user: req.params.id });

  // if (!cart) {
  //   return next(
  //     new appError(`There is no such cart with id ${req.body.cartId}`, 404)
  //   );
  // }
  res.status(200).send({
    status: 'Success Deleted',
  });
});


exports.updateCartItemPlus = catchAsync(async (req, res, next) => {

  const cart = await Cart.findOne({ user: req.params.id });

  if (!cart) {
    return next(new appError(`there is no cart for user ${req.params.id}`, 404));
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.query.productId
  );

  //console.log(cart.cartItems);
  //console.log(itemIndex); 
  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = cartItem.quantity + 1;

    cart.cartItems[itemIndex] = cartItem;
  } else {
    return next(
      new appError(`there is no item for this id :${req.query.productId}`, 404)
    );
  }
  cart.calcTotalCartPrice(cart);


  await cart.save();

  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});


exports.updateCartItemMinus = catchAsync(async (req, res, next) => {

  const cart = await Cart.findOne({ user: req.params.id });

  if (!cart) {
    return next(new appError(`there is no cart for user ${req.params.id}`, 404));
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.query.productId
  );

  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    if (cartItem.quantity >= 2) cartItem.quantity = cartItem.quantity - 1;
    else {
      return next(new appError(`Quantity cannot be reduced further for this item`, 400));
    }

    cart.cartItems[itemIndex] = cartItem;
  } else {
    return next(
      new appError(`there is no item for this id :${req.query.productId}`, 404)
    );
  }
  cart.calcTotalCartPrice(cart);


  await cart.save();

  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});


exports.applyCoupon = catchAsync(async (req, res, next) => {
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new appError(`Coupon is invalid or expired`));
  }

  const cart = await Cart.findOne({ user: req.params.id });

  if (!cart) {
    return next(
      new appError(`There is no such cart with id ${req.query.cartId}`, 404)
    );
  }

  const totalPrice = cart.totalCartPrice;

  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2); // 99.23

  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();

  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
