const mongoose = require('mongoose');
const validator = require('validator');
const User=require('../Models/userModel')
const slugify=require('slugify')
const _ = require('lodash')

require('dotenv').config();

const petSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'The name field must not be empty']
    },
    image:{
        type:String,
        required:[true,'The image field must not be empty']
     
    },
    type:{
        type:String,
        required:[true,'The image field must not be empty']
       
    },
    birthday:{
        type:String,
        required:[true,'The birthday field must not be empty']
        
    },category:{
        type:String,
        required:[true,'The category field must not be empty']
    },status:{
        type:String,
        //required:[true,'The status field must not be empty']
        
    },gender:{
        type:String,
        required:[true,'The gender field must not be empty']
    }
    ,discription:{
        type:String,
        required:[true,'The discription field must not be empty'] 
    },
    weigth:{
        type:Number,
        required:[true,'The weight field must not be empty']
    },
    height:{
        type:Number,
        required:[true,'The height field must not be empty']
    },owner:{
        type:String,
        enum:['user','adoption'],
        //required:[true,'The adoption field must not be empty'] 
        default:'user'
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'user',
       // required:[true,"pet must belong to a user."]
    }
},

    {
        toJSON:{virtuals:true, transform:(doc,retuDoc)=>_.omit(retuDoc,['__v'])},
        toObject:{virtuals:true}
    }

)



petSchema.pre(/^find/,function(next){

    this.populate({
        path:'user',
        select:'-email -password -createdAt -updatedAt -__v'
    
    
    });
    next()
})

const petModle = mongoose.model('pet',petSchema);

module.exports = petModle