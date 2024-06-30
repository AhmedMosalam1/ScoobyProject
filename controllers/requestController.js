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
    const userId = req.user.id;
    const serviceType = req.body.serviceType
    const payment = req.body.payment
    let serviceImage , paymentImage
    if(serviceType ==="Pet Boarding"){
        serviceImage = "https://res.cloudinary.com/dtny7jzz1/image/upload/v1719732594/Scooby/Requests/Pet_Boarding_gfaw9u.png"
        
    }else if(serviceType ==="Pet Grooming"){
        serviceImage = "https://res.cloudinary.com/dtny7jzz1/image/upload/v1719732595/Scooby/Requests/Pet_Grooming_xzqnfa.png"

    }else if(serviceType ==="Pet Sitting"){
        serviceImage = "https://res.cloudinary.com/dtny7jzz1/image/upload/v1719732595/Scooby/Requests/Pet_Sitting_s8ezos.png"
        
    }else if(serviceType ==="Pet Walking"){
        serviceImage = "https://res.cloudinary.com/dtny7jzz1/image/upload/v1719732594/Scooby/Requests/Pet_Walking_blswgj.png"
        
    }else if(serviceType ==="Pet Veterinary"){
        serviceImage = "https://res.cloudinary.com/dtny7jzz1/image/upload/v1719732596/Scooby/Requests/Pet_Veterinary_dickzd.png"
        
    }else if(serviceType ==="Pet Training"){
        serviceImage = "https://res.cloudinary.com/dtny7jzz1/image/upload/v1719732593/Scooby/Requests/Pet_Training_b4hncm.png"

    }else if(serviceType ==="Pet Taxi"){
        serviceImage = "https://res.cloudinary.com/dtny7jzz1/image/upload/v1719732593/Scooby/Requests/Pet_Taxi_tjncqa.png"
    }



    if(payment ==="Visa"){
        paymentImage = "https://res.cloudinary.com/dtny7jzz1/image/upload/v1719737759/Scooby/Requests/hqwcqorvphfqgu1ugldy.png"
        
    }else if(payment ==="Master Card"){
        paymentImage = "https://res.cloudinary.com/dtny7jzz1/image/upload/v1719737759/Scooby/Requests/au7pkupnxyz3gx9w6oip.png"

    }else if(payment ==="Local Cards"){
        paymentImage = "https://res.cloudinary.com/dtny7jzz1/image/upload/v1719737759/Scooby/Requests/rxwqf7ogygxxmwabug1c.png"
        
    }else if(payment ==="Mobile Wallet"){
        paymentImage = "https://res.cloudinary.com/dtny7jzz1/image/upload/v1719737759/Scooby/Requests/qpjgbmwrpe6wabhroddh.png"
        
    }else if(payment ==="Cash"){
        paymentImage = "https://res.cloudinary.com/dtny7jzz1/image/upload/v1719737759/Scooby/Requests/komeob4uqy96wsxbwvjj.png"
        
    }



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
        serviceImage,
        paymentImage,
        ...req.body
    });

    res.status(200).json({ status: 'success',request });
    //next()
});
//-------------------------------------------------------------upcoming booking
exports.upcomingBooking = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const request = await requestModel.find({
        userId: userId,
        date: { $gt: Date.now() },
    });
    res.status(200).json({
        results:request.length,
        request,
    });
});
//-------------------------------------------------------------past booking
exports.pastBooking = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const request = await requestModel.find({
        userId: userId,
        date: { $lt: Date.now() },
    });
    
    //const request = await requestModel.find();
    
    res.status(200).json({
        results:request.length,
        request,
    });
});
