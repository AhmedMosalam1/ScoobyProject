const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash')

require('dotenv').config();

const plogSchema = new mongoose.Schema({
    blogImage:{
        type:String,
       // required:[true,'The image field must not be empty']
     
    },
    description:{
        type:String,
        //required:[true,'The image field must not be empty']
       
    },
    link:{
        type:String,
       // required:[true,'The image field must not be empty']
        
    }
    
},



    {toJSON:{
        transform:(doc,retuDoc)=>_.omit(retuDoc,['__v'])
    }}
)



const plogModle = mongoose.model('plog',plogSchema);

module.exports = plogModle  