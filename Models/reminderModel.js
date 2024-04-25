const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const _ = require('lodash')
require('dotenv').config();

const reminderSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title:{
        type:String
    },
    notes:{
        type:String
    },
    date:{
        type:Date
    }
},{
    timestamps: true,
})

const reminderModel = mongoose.model('reminders',reminderSchema);

module.exports = reminderModel