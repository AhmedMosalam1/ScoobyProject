const catchAsync = require("express-async-handler");
const requestModel = require("../Models/requestModel");
const userModel = require("../Models/userModel");
const appError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const multer = require("multer");
const cloudinary = require("../utils/cloud");
const sharp = require("sharp");
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

//-------------------------------------------------------------add request
exports.addRequest = catchAsync(async (req, res) => {
    const userId = req.params.id;
    const request = await requestModel.create({
        userId,
        ...req.body
    });
    res.status(200).json({
        request
    });
});
//-------------------------------------------------------------upcoming booking
exports.upcomingBooking = catchAsync(async (req, res) => {
    const userId = req.params.id;
    const request =await requestModel.find({ userId: userId, date: { $gt: Date.now() } });
    res.status(200).json({
        request
    });
});
//-------------------------------------------------------------past booking
exports.pastBooking = catchAsync(async (req, res) => {
    const userId = req.params.id;
    const request = await requestModel.find({ userId: userId, date: { $lt: Date.now() } });
    res.status(200).json({
        request
    });
});