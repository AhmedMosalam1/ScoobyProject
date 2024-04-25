const catchAsync = require('express-async-handler');
const remenderModel = require('../Models/reminderModel')
const doctorModel = require('../Models/doctorModel')
const userModel = require("../Models/userModel")
const appError = require("../utils/appError")
const jwt = require('jsonwebtoken')
const multer = require("multer")
const cloudinary = require("../utils/cloud")
const sharp = require("sharp");
const reminderModel = require('../Models/reminderModel');
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

//-------------------------------------------------------------add reminder
exports.addreminder = catchAsync(async(req,res,next)=>{
    const userId = req.params.id
    const remender = await remenderModel.create({
        userId,
        ...req.body
    })
    res.status(200).json({
        remender
    })
})
//-------------------------------------------------------------get my reminders info
exports.getMyRemindersInfo = catchAsync(async(req,res,next)=>{
    const userId = req.params.id
    const userReminders = await remenderModel.find({userId:userId})
    const todayDate = new Date().getDate();
    const todayReminders = userReminders.filter(reminder => {
        const reminderDate = new Date(reminder.date).getDate();
        return reminderDate === todayDate;
    });

    const scheludedReminders = userReminders.length - todayReminders.length
    
    res.status(200).json({
        todayDate: new Date(Date.now()),
        today:todayReminders.length,
        scheluded:scheludedReminders,
        all:userReminders.length
    })
})
//-------------------------------------------------------------get upcomming reminders
exports.getUpcommingReminders = catchAsync(async(req,res,next)=>{
    const userId = req.params.id
    const upCommingReminders = await remenderModel.find({
        userId:userId,
        date: { $gt: Date.now() }
    });
    res.status(200).json({
        upCommingReminders
    })
})
//-------------------------------------------------------------delete reminder
exports.deleteReminder = catchAsync(async(req,res,next)=>{
    const reminderId = req.params.id ;
    const reminder = await reminderModel.findByIdAndDelete(reminderId)
    res.status(200).json({
        Message : 'reminder deleted successfully'
    })
})
//-------------------------------------------------------------update reminder
exports.updateReminder = catchAsync(async(req,res,next)=>{
    const reminderId = req.params.id ;
    const updatedReminder = await reminderModel.findByIdAndUpdate(reminderId,req.body,{new:true})
    res.status(200).json({
        updatedReminder
    })
})