const catchAsync = require('express-async-handler');
const petModel = require('../Models/petsModel')
const usermodel=require('../Models/userModel')
const appError = require("../utils/appError")


exports.setUserIds=(req,res,next)=>{
    
     if(!req.body.user){
         req.body.user=req.user.id
        // console.log(req.body.user)
     }
    next()
    
    }


exports.addpet=catchAsync(async(req,res,next)=>{
 
    const newpet=await petModel.create(req.body)
    res.status(201).json({
        status:'success',
        data:newpet
    })

})
exports.getpets=catchAsync(async(req,res,next)=>{
   


   const pets=await petModel.find()
//.populate({
//         path:'user',
//         select:'Name' 

// })
    res.status(200).json({
        status:'success',
            data:pets
            
        })
})



