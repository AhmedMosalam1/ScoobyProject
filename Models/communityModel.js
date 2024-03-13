const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const _ = require('lodash')
require('dotenv').config();

const communitySchema = new mongoose.Schema({
    userId:{
        type:String
    },
    userImage:{
        type:String
    },
    userName:{
        type:String
    },
    postImage:{
        type:String,
    },
    description:{
        type:String,
    },
    likes:{
        type:Number,
        default:0
    },
    onlyMe:{
        type: Boolean
    }
},{
    timestamps: true,
})

const communityModel = mongoose.model('community',communitySchema);

module.exports = communityModel