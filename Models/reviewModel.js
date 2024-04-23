const mongoose=require('mongoose');
const slugify=require('slugify')
const validator=require('validator')
//const User=require('./usermodel')
const serviceProfileModel=require('../Models/serviceProfileModel')
const doctorModel=require('../Models/doctorModel')
const reviewSchema=new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
        
    },
    review:{
        type:String,
        //required:[true,'Review cant be empty'],
        trim:true,
        
    },
    rating:{
        type:Number,
        
        //min:[1,'rating should be more than 1.0'],
        //max:[5,'rating should be less than 5.0'],
    },
    createdAt:{
    type:Date,
        default:Date.now()
    },
    service:{
            type:mongoose.Schema.ObjectId,
            ref:'serviceProfile',
            //required:[true,"Review must belong to a service."]
        }
    ,
    doctor:{
        type:mongoose.Schema.ObjectId,
        ref:'doctor',
        //required:[true,"Review must belong to a service."]
    },
    user:{
            type:mongoose.Schema.ObjectId,
            ref:'user',
           // required:[true,"Review must belong to a user."]
        }
    

},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})


//reviewSchema.index({service:1,user:1},{unique:true})



// reviewSchema.pre(/^find/,function(next){

//     this.populate({
//         path:'serviceProfile',
//         select:'name'
    
    
//     });
//     next()
// })


reviewSchema.pre(/^find/,function(next){

    this.populate({
        path:'user',
        select:'name profileImage'
    
    
    });
    next()
})




reviewSchema.statics.calcAverageRatings=async function(id){
const stats=await this.aggregate([{
    $match:{doctor:id},
    

},{
    $group:{
        _id:'$doctor',
        nRating:{$sum:1},
        avgRating:{$avg:'$rating'}
    }
}

])


//console.log(stats)

if(stats.length >0){
    await doctorModel.findByIdAndUpdate(id,{
        rate:stats[0].avgRating, 
        numberOfRate:stats[0].nRating
    
    
    })
    }else{
        await doctorModel.findByIdAndUpdate(id,{
            rate:4.5, 
            numberOfRate:0
        
        
        })

    }

}
/////////////////////////////////////////////////////////////////////////
reviewSchema.statics.calcAverageRatingofService=async function(id){
    const stats=await this.aggregate([{
        $match:{service:id},
        
    
    },{
        $group:{
            _id:'$service',
            nRating:{$sum:1},
            avgRating:{$avg:'$rating'}
        }
    }
    
    ])
    
    
    //console.log(stats)
    
    if(stats.length >0){
        await serviceProfileModel.findByIdAndUpdate(id,{
            rate:stats[0].avgRating, 
            numberOfRate:stats[0].nRating
        
        
        })
        }else{
            await serviceProfileModel.findByIdAndUpdate(id,{
                rate:4.5, 
                numberOfRate:0
            
            
            })
    
        }
    
    }


reviewSchema.post('save',function(){
//this points to current review
this.constructor.calcAverageRatings(this.doctor);
this.constructor.calcAverageRatingofService(this.service);


})




const Review=mongoose.model('review',reviewSchema)

module.exports=Review



//






