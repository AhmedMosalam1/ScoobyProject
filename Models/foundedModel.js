const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash')

require('dotenv').config();

const foundedSchema = new mongoose.Schema({
    petImage:{
        type:String,
       // required:[true,'The image field must not be empty'] 
    },
    description:{
        type:String,
        //required:[true,'The discription field must not be empty'] 
    },
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:'user',
       // required:[true,'The image field must not be empty'] 
    },
    locations:
    {
        type:String
    },
    phoneNumber:{
        type:String
    },
    type:{
        type:String
    }
    
},{
    timestamps: true
    }
)



const foundedModel = mongoose.model('found',foundedSchema);

module.exports = foundedModel 
