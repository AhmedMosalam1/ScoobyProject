const mongoose = require('mongoose');
const validator = require('validator');
const User=require('./userModel')
const slugify=require('slugify')
const _ = require('lodash')

require('dotenv').config();

const petSchema = new mongoose.Schema({
    name:{
        type:String,
        //required:[true,'The name field must not be empty']
    },
    petImage:{
        type:String,
        //required:[true,'The image field must not be empty']
     
    },
    type:{
        type:String,
        enum:['dog','cat']
       // required:[true,'The image field must not be empty']
       
    },
    birthday:{
        type:Date,
       // required:[true,'The birthday field must not be empty ..(1 Novmber 2023)']
        
    },category:{
        type:String,
        
       // required:[true,'The category field must not be empty']
    },status:{
        type:String,
        //required:[true,'The status field must not be empty']
        
    },gender:{
        type:String,
        //required:[true,'The gender field must not be empty']
    }
    ,profileBio:{
        type:String,
        //required:[true,'The profileBio field must not be empty'] 
    },
    weight:{
        type:Number,
        //required:[true,'The weight field must not be empty']
    },
    adoptionDay:{
        type:Date,
        //required:[true,'The birthday field must not be empty ..(1 Novmber 2023)']
    },size:{
        type:String,
        //required:[true,'The size field must not be empty']
    }
    ,owner:{
        type:String,
        enum:['user','adoption','shelter'],
        //required:[true,'The adoption field must not be empty'] 
        default:'user'
    },
    // shelter_id:{

    // },
    // shelterName:{
    //     type:String
    // },
    // inShelter:{
    //     type:Boolean
    // },
        shelterInfo:{
        type:mongoose.Schema.ObjectId,
        ref:'shelter',
    },
    availableForAdoption:{
        type:Boolean
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'user',
       // required:[true,"pet must belong to a user."]
    }
    ,institution_id:{
        type:String
    },
    vaccinations_id:[{
        type:String 
    }],
    petsforkids:{
        type:Boolean
    }
},

    {
        toJSON:{virtuals:true, transform:(doc,retuDoc)=>_.omit(retuDoc,['__v'])},
        toObject:{virtuals:true}
    }

)



// petSchema.pre(/^find/,function(next){

//     this.populate({
//         path:'user',
//         select:'-email -password -createdAt -updatedAt -__v'
    
    
//     });
//     next()
// })

const petModle = mongoose.model('pet',petSchema);

module.exports = petModle
