const catchAsync = require('express-async-handler');
const vaccineModel = require('../Models/vaccineModel')
const doctorModel = require('../Models/doctorModel')
const userModel = require("../Models/userModel")
const appError = require("../utils/appError")
const jwt = require('jsonwebtoken')
const multer = require("multer")
const cloudinary = require("../utils/cloud")
const sharp = require("sharp")
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

//-------------------------------------------------------------add vaccine
exports.addvaccine = catchAsync(async(req,res,next)=>{
    const petId = req.params.id
    const vaccine = await vaccineModel.create({
        petId,
        ...req.body
    })
    res.status(200).json({
        vaccine
    })
})
//-------------------------------------------------------------get all pet vaccines
exports.getAllPetVaccines = catchAsync(async(req,res,next)=>{
    const petId = req.params.id
    const vaccine = await vaccineModel.find({petId:petId})
    res.status(200).json({
        vaccine
    })
    
})
//-------------------------------------------------------------get doctor by name
exports.getDoctorByName = catchAsync(async(req,res,next)=>{
    const doctorName = req.query.doctorName ;
    const doctor = await doctorModel.find({name:doctorName})
    res.status(200).json({
        doctor
    })
    
})
//-------------------------------------------------------------delete vaccine
exports.deleteVaccine = catchAsync(async(req,res,next)=>{
    const vaccineId = req.params.id ;
    const vaccine = await vaccineModel.findByIdAndDelete(vaccineId)
    res.status(200).json({
        Message : 'vaccine deleted successfully'
    })
    
})
//-------------------------------------------------------------update vaccine
exports.updateVaccine = catchAsync(async(req,res,next)=>{
    const vaccineId = req.params.id ;
    const updatedVaccine = await vaccineModel.findByIdAndUpdate(vaccineId,req.body,{new:true})
    res.status(200).json({
        updatedVaccine
    })
})
//-------------------------------------------------------------get vaccine by name
exports.getVaccineByName = catchAsync(async(req,res,next)=>{
    const vaccineName = req.query.vaccineName ;
    const vaccine = await vaccineModel.find({vaccineName:vaccineName})
    res.status(200).json({
        vaccine
    })
})