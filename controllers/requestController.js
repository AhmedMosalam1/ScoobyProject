const catchAsync = require("express-async-handler");
const requestModel = require("../Models/requestModel");
const userModel = require("../Models/userModel");
const appError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const multer = require("multer");
const cloudinary = require("../utils/cloud");
const sharp = require("sharp");
const bcrypt = require("bcrypt");
require("dotenv").config();
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

//-------------------------------------------------------------add request
exports.addRequest = catchAsync(async (req, res, next) => {
    const userId = req.params.id;
    const { cardNumber, cardExpireDate, cardSecurityCode } = req.body;

    if (req.body.saveCard) {
        const user = await userModel.findById(userId);
        console.log(user.cards)
        const existingCard = user.cards.find(el => el.cardNumber === cardNumber);
        if (existingCard) {
            console.log(cardNumber)
            return next(new appError("Card already saved"));
        } else {
            const hashedCardSecurityCode = await bcrypt.hash(cardSecurityCode, Number(process.env.SALT));
            const newCard = { cardNumber, cardExpireDate, hashedCardSecurityCode };
            user.cards.push(newCard);
            await user.save();
            //next()
        }
    }

    const request = await requestModel.create({
        userId,
        ...req.body
    });

    res.status(200).json({ request });
    //next()
});
//-------------------------------------------------------------upcoming booking
exports.upcomingBooking = catchAsync(async (req, res) => {
    const userId = req.params.id;
    const request = await requestModel.find({
        userId: userId,
        date: { $gt: Date.now() },
    });
    res.status(200).json({
        request,
    });
});
//-------------------------------------------------------------past booking
exports.pastBooking = catchAsync(async (req, res) => {
    const userId = req.params.id;
    const request = await requestModel.find({
        userId: userId,
        date: { $lt: Date.now() },
    });
    res.status(200).json({
        request,
    });
});
