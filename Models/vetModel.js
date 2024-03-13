const mongoose = require('mongoose');

const vetSchema = new mongoose.Schema({
    vetName: {
        type: String
    },
    vetImage: {
        type: String
    },
    bio: {
        type: String
    },
    rate: {
        type: Number
    },
    numberOfRate: {
        type: String
    },
    review: {
        type: String
    },
    callNumber: {
        type: String
    },
    locations:
    {
        type: {
            type: String,
            default: "Point",
        },
        coordinates: [Number],
        address: String,
    }
}, {
    timestamps: true
})


const vetModel = mongoose.model('vet', vetSchema);

module.exports = vetModel