const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const _ = require('lodash')
require('dotenv').config();

const vaccineSchema = new mongoose.Schema({
    petId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'pet'
    },
    vaccineName:{
        type:String
    },
    vaccinationDate:{
        type:Date
    },
    validUnit:{
        type:Date
    },
    expiryDate:{
        type: Date
    },
    lot:{
        type:String
    },

    veterinarian:{
        type:String
    },
    notes:{
        type:String
    }
},{
    timestamps: true,
})

const vaccineModel = mongoose.model('vaccines',vaccineSchema);

module.exports = vaccineModel