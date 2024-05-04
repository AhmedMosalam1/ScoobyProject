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
    nationalID:{
        type:String,
    },
    workplace:{
        type:String,
    },
    licenseImage:{
        type:String,
    },
    country:{
        type: String
    },
    personalID:{
        type:String
    },
    carImage:{
        type:String
    },
    gender:{
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
    },
    phone:{
        type: Number
    },serviceProfile:{
        type:mongoose.Schema.ObjectId,
            ref:'serviceProfile',
    }
},{
    timestamps: true,
})




const serviceModel = mongoose.model('services',serviceSchema);

module.exports = serviceModel
