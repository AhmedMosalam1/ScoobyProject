const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    desc: {
        type: String,
    },
    quantity: {
        type: Number
    },
    price: {
        type: Number
    },
    discount: {
        type: Number
    },
    priceAfterDiscount: {
        type: Number
    },
    productImage: {
        type: String,
    },
    category: {
        type: String,
        enum: ["medicine", "food", "toys", "grooming", "accessories"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true
    },
}, {
    timestamps: true
})

productSchema.pre('save', function (next) {
    if (this.discount && this.discount > 0) {
        const discountedPrice = this.price - (this.price * (this.discount / 100));
        this.priceAfterDiscount = Math.round(discountedPrice);
    } else {
        this.priceAfterDiscount = this.price;
    }
    next();
});

const productModel = mongoose.model('product', productSchema);

module.exports = productModel