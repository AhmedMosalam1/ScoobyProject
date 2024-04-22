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
    // availableTime:{
    //     type:String,


    // },
    // city:{
    //     type:String,
    // }
    // ,
    rate:{
        type:Number,
        set:val=>Math.round(val*10)/10
    },
    numberOfRate:{
        type:Number
    },
    review:{
        type:String
    },
    imagesProfile:[String],
    phone:{
        type:String
    },about:{
        type:String
    },specialized_in:[
        String
    ],
    accepted_pet_types:[{
        type:String,
        //enum:['Dogs','Cats']
    }
    ],
    // reviewsOfDoctors:[{
    //     type:mongoose.Schema.ObjectId,
    //     ref:'review',
    // }]

    
},



    {toJSON:{virtuals:true},
    toObject:{virtuals:true}}
)


//virtual populate
doctorSchema.virtual('reviewsOfDoctor',{
    ref:'review',
    foreignField:'doctor',
    localField:'_id'

})

const doctormodel = mongoose.model('doctor',doctorSchema);

module.exports = doctormodel