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
    serviceImage:{
        type:String
    },
    serviceType:{
        type:String,
        enum:["Pet Walking","Pet Veterinary","Pet Training","Pet Taxi","Pet Sitting","Pet Grooming","Pet Boarding"]
    },
    servicePrice:{
        type:Number
    },
    requestTotalPrice:{
        type:Number
    },
    location:[String],
    petsId:[String],
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
    paymentImage:{
        type:String
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
