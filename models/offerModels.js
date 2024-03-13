const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    desc: {
        type: String,
    },
    expireDate: {
        type: Date
    },
    discount: {
        type: Number
    },
    offerImage: {
        type: String,
    }
}, {
    timestamps: true
})


const offerModel = mongoose.model('offer', offerSchema);

module.exports = offerModel