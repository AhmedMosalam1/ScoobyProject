const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {
      cartItems: [
        {
          product: {
            type: mongoose.Schema.ObjectId,
            ref: 'product',
          },
          quantity: {
            type: Number,
            default: 1,
          },
          price: Number,
        },
      ],
      totalCartPrice: Number,
      totalPriceAfterDiscount: Number,
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
      },
    },
    { timestamps: true }
  );
  
  cartSchema.methods.calcTotalCartPrice = function (cart) {
    let totalPrice = 0;
    cart.cartItems.forEach((item) => {
      totalPrice += item.quantity * item.price;
    });
    cart.totalCartPrice = totalPrice;
    cart.totalPriceAfterDiscount = undefined;
    return totalPrice;
  }
  
  module.exports = mongoose.model('Cart', cartSchema);