const mongoose=require('mongoose');
const slugify=require('slugify')
const validator=require('validator')
//const User=require('./usermodel')
const Tour=require('./serviceModel')
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
            ref:'services',
            //required:[true,"Review must belong to a service."]
        }
    ,
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



reviewSchema.pre(/^find/,function(next){

    this.populate({
        path:'service',
        select:'serviceType'
    
    
    });
    next()
})


reviewSchema.pre(/^find/,function(next){

    this.populate({
        path:'user',
        select:'name profileImage'
    
    
    });
    next()
})


// reviewSchema.statics.calcAverageRatings=async function(tourId){
// const stats=await this.aggregate([{
//     $match:{tour:tourId}
// },{
//     $group:{
//         _id:'$tour',
//         nRating:{$sum:1},
//         avgRating:{$avg:'$rating'}
//     }
// }



// ])

//console.log(stats)

// if(stats.length >0){
//     await Tour.findByIdAndUpdate(tourId,{
//         ratingsAverage:stats[0].avgRating, 
//         ratingsQuantity:stats[0].nRating
    
    
//     })
//     }else{
//         await Tour.findByIdAndUpdate(tourId,{
//             ratingsAverage:4.5, 
//             ratingsQuantity:0
        
        
//         })

//     }

// }
// // save to the tour


// reviewSchema.post('save',function(){
// //this points to current review
// this.constructor.calcAverageRatings(this.tour);


// })


// reviewSchema.pre(/^findOneAnd/,async function(next){
// this.r=await this.findOne()
// //console.log(this.r)
// next()
// })

// reviewSchema.post(/^findOneAnd/,async function(){

//     //await this.findOne() dose not work here query has allredy executed
//     await this.r.constructor.calcAverageRatings(this.r.tour)
//     })



const Review=mongoose.model('review',reviewSchema)

module.exports=Review



//






