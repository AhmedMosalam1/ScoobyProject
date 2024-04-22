const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash')

require('dotenv').config();

const ServiceProfileSchema = new mongoose.Schema({
    icon:{
        type:String,

    },
    name:{
        type:String,
       // required:[true,'The image field must not be empty']
     
    },description:{
        type:String,

    },
    rate:{
        type:Number,
        set:val=>Math.round(val*10)/10
       
    },
    numberOfRate:{
        type:Number,
       // required:[true,'The image field must not be empty']
    },
    imagesProfile:[String],
    price:{
        type:Number
    },
    from:{
        type:Number
    },
    to:{
        type:Number
    },
    pricePer:{
        type:String,
    },
    
    about:{
        type:String
    },
    
    accepted_pet_types:[{
        type:String,
        //enum:['Dogs','Cats']
    }
    ],
    accepted_pet_sizes:[{
        type:String,
        //enum:['Dogs','Cats']
    }
    ],
    question1:[{
        type:String,
        
    }
    ],
    question2:[{
        type:String,
        
    }
    ],
    question3:[{
        type:String,
        
    }
    ],

    
},



    {toJSON:{virtuals:true},
    toObject:{virtuals:true}}
)


//virtual populate
ServiceProfileSchema.virtual('reviewsOfService',{
    ref:'review',
    foreignField:'service',
    localField:'_id'

})

const ServiceProfileModel = mongoose.model('serviceProfile',ServiceProfileSchema);

module.exports = ServiceProfileModel