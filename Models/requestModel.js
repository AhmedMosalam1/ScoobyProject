const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const _ = require('lodash')
require('dotenv').config();

const requestSchema = new mongoose.Schema({
    userId:{
        type:String
    },
    serviceType:{
        type:String
    },
    date:{
        type:Date
    },
    time:{
        type:String
    },
    duration:{
        type:String,
        enum:['Full Day','Half Day','More than 1 Day']
    },
    location:{
        type: String
    },
    notes:{
        type:String
    },
    pickUp:{
        type:Boolean
    },
    payment:{
        type:String,
        enum:['Visa','Master Card','Local Cards','Mobile Wallet','Cash']
    },
    country:{
        type:String
    },
    number:{
        type:String
    },
    petsNumber:{
        type:Number
    },
    completed:{
        type:Boolean,
        default:false
    },
    notes:{
        type:String
    },
    remindMe3Hours:{
        type:Boolean
    },
    cardNumber:{
        type:String
    },
    cardExpireDate:{
        type:Date
    },
    cardSecurityCode:{
        type:String
    },
    saveCard:{
        type:Boolean
    }
},{
    timestamps: true,
})

const requestModel = mongoose.model('requesties',requestSchema);

module.exports = requestModel