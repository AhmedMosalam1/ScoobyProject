const catchAsync = require('express-async-handler');
const serviceModel = require('../Models/serviceModel')
const appError = require("../utils/appError")
const jwt = require('jsonwebtoken')
const nodemailer=require('nodemailer')
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

//-------------------------------------------------------------create service
exports.createService = catchAsync(async(req,res)=>{
    const service = await serviceModel.create(req.body)
    res.status(200).json({
        service
    })
    
})
//-------------------------------------------------------------get all services
exports.getAllServices = catchAsync(async(req,res)=>{
    const allServices = await serviceModel.find()
    res.status(200).json({
        // image : allServices.serviceImage,
        // type : allServices.serviceType ,
        // rate: allServices.rate ,
        // country : allServices.country ,
        // price : allServices.price ,
        allServices
    })
    
})