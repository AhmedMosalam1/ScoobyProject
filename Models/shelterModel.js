const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const _ = require('lodash')
require('dotenv').config();

const shelterSchema = new mongoose.Schema({
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
    },
    available_places:{
        type:Number
    },
    pets_Id:[{
        type:mongoose.Schema.ObjectId,
        ref:'pets',
    }],
},{
    timestamps: true,
})

const shelterModel = mongoose.model('shelter',shelterSchema);

module.exports = shelterModel