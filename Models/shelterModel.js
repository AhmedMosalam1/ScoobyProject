const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const _ = require('lodash')
require('dotenv').config();

const shelterSchema = new mongoose.Schema({
    shelterImages:[String],
    shelterName:{
        type:String
    },
    shelterImage:{
        type:String
    },
    shelterNumber:{
        type:String
    },
    description:{
        type:String
    },
    rate:{
        type:Number
    },
    numberOfRates:{
        type:Number
    },
    ownerDetails:{
        type:String
    },
    locations:
    {
        type: {
            type: String,
            default: "Point",
        },
        coordinates: [Number],
        address: String,
    },about:{
        type:String
    },
    available_places:{
        type:Number
    },
    pets_Id:[{
        type:mongoose.Schema.ObjectId,
        ref:'pet',
    }],
},{
    timestamps: true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})


shelterSchema.virtual('reviewsOfShelter',{
    ref:'review',
    foreignField:'shelter',
    localField:'_id'

})
const shelterModel = mongoose.model('shelter',shelterSchema);

module.exports = shelterModel