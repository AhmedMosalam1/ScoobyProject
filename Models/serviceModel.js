const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const _ = require('lodash')
require('dotenv').config();

const serviceSchema = new mongoose.Schema({
    serviceType:{
        type:String
    },
    city:{
        type:String
    },
    serviceImage:{
        type:String
    },
    rate:{
        type:Number
    },
    price:{
        type:Number
    },
     pricePer:{
        type:String
    }
    ,serviceProfile:{
        type:mongoose.Schema.ObjectId,
            ref:'serviceProfile',
    }
},{
    timestamps: true,
})




const serviceModel = mongoose.model('services',serviceSchema);

module.exports = serviceModel
