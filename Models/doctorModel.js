const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash')

require('dotenv').config();

const doctorSchema = new mongoose.Schema({
    name:{
        type:String,
       // required:[true,'The image field must not be empty']
     
    },
    doctorImage:{
        type:String,
        //required:[true,'The image field must not be empty']
       
    },
    description:{
        type:String,
       // required:[true,'The image field must not be empty']
    },
    rete:{
        type:Number
    },
    nmberOfRate:{
        type:Number
    },
    review:{
        type:String
    }
    
},



    {toJSON:{
        transform:(doc,retuDoc)=>_.omit(retuDoc,['__v'])
    }}
)



const doctormodel = mongoose.model('doctor',doctorSchema);

module.exports = doctormodel