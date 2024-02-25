const catchAsync = require('express-async-handler');

const userModel = require('../models/userModel')
const appError = require("../utils/appError")
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const crypto = require("crypto");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;


const createSendToken = (res, result, statusCode) => {

    const token = result.generateToken(result._id)

    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
    }

    if (process.env.NODE_ENV == "production") cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions)

    result.password = undefined

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            result
        }
    })
}

//----------------------------------------------------------------------------------------- sign up

exports.signup = catchAsync(async (req, res, next) => {
    const email_exist = req.body.email
    const user_exist = await userModel.findOne({ email: email_exist })
    if (!user_exist) {
        const result = await userModel.create(req.body);
        createSendToken(res, result, 200)
    }
    else {
        return next(new appError('Email is Already Exist', 401))
    }
})

//----------------------------------------------------------------------------------------- log in 

exports.login = catchAsync(async (req, res, next) => {

    const { email, password } = req.body;
    if (!email || !password) {
        return next(new appError('please enter a valid email or password', 400))
    }
    const result = await userModel.findOne({ email })

    if (!result || !(await result.correctPassword(password, result.password))) {
        return next(new appError('Incorrect Email or Password', 401))
    }
    createSendToken(res, result, 201)
})

//------------------------------------------------------------------------------------------ log out

exports.logout = catchAsync(async (req, res) => {
    //req.logOut();
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() - 1 * 1000),
        httpOnly: true
    });
    res.status(200).json({ status: 'Logout successfully' });
})

//-------------------------------------------------------------------------------------------- forget password (send code)

exports.sendforgotpasscode = catchAsync(async (req, res, next) => {
    // const user=await userModel.findOne({email:req.body.email})
    // if(!user){
    //     return next(new appError('User not found',400))
    // }
    // const secet=process.env.JWT_SECRET+user.password
    // const token=jwt.sign({email:user.email,id:user.id},secet,{
    //     expiresIn:'60m'
    // })
    // const link=`https://scoobyfamily.onrender.com/scooby/api/users/reset-password/${user.id}/${token}`;
    // const transporter=nodemailer.createTransport({
    //     service:'gmail',
    //     auth:{
    //         user:process.env.USER_EMAIL,
    //         pass:process.env.USER_PASS
    //     }
    // })
    // const mailOptions={
    //     from:process.env.USER_EMAIL,
    //     to:user.email,
    //     subject:'reset password',
    //     html:`<div>
    //     <h4>Click on the link to reset your password</h4>
    //     <p>${link}</p>
    //         </div>`
    // }
    // //res.json({message:'click on this link',resetpasslink:link})
    // console.log(link)
    // transporter.sendMail(mailOptions,function(err,success){
    //     if(err){
    //         console.log(err)
    //     }else{
    //         console.log('Email sent : ')
    //     }
    // })
    // //res.render('link-send')
    // res.status(200).json({
    //     userId:user.id,
    //     token
    // })

    const user = await userModel.findOne({ email: req.body.email })
    if (!user) {
        return next(new appError('User not found', 400))
    }


    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedResetCode = crypto
        .createHash('sha256')
        .update(resetCode)
        .digest('hex');

    user.passwordResetCode = hashedResetCode;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    user.passwordResetVerified = false;

    await user.save()

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASS
        }
    })
    const mailOptions = {
        from: process.env.USER_EMAIL,
        to: user.email,
        subject: 'reset password',
        // html:`<div>
        // <h4>Your Code</h4>
        // <p>${code}</p>
        //     </div>`
        html: `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cool OTP Display</title>
    <style>
        body {
            color: var(--text-color);
            font-family: 'Arial', sans-serif;
            text-align: center;
            padding: 50px;
            margin: 0;
            background-color: var(--background-color);
        }

        h1 {
            color: #4733ab;
            display: inline-block;
        }

        .logo {
            vertical-align: middle;
            margin-left: 10px;
            width: 50px; /* Adjust width as needed */
            height: auto;
        }

        .otp-container {
            border: 2px solid #4733ab;
            padding: 20px;
            border-radius: 10px;
            background-color: rgba(30, 30, 30, 0.7); /* Adding opacity for better readability */
            margin-top: 20px;
            display: inline-block;
        }

        .otp-number {
            font-size: 24px;
            letter-spacing: 8px;
            margin: 10px 0;
            color: #800080; /* Change the color to black-purple */
        }

        .otp-validity, .reset-message {
            font-size: 18px;
            color: var(--text-color);
            margin-top: 20px;
        }

        p {
            font-size: 18px;
        }

        /* Define colors for light mode */
        @media (prefers-color-scheme: light) {
            :root {
                --text-color: #000000; /* Black text */
                --background-color: #ffffff; /* White background */
            }
        }

        /* Define colors for dark mode */
        @media (prefers-color-scheme: dark) {
            :root {
                --text-color: #ffffff; /* White text */
                --background-color: #282c35; /* Dark background */
            }
        }
    </style>
</head>
<body>

    <h1>Scooby Family <img src="https://res.cloudinary.com/dtny7jzz1/image/upload/v1708816114/Scooby/Offers/download.jpg.jpg" alt="Logo" class="logo"></h1>

    <p class="reset-message">Hi ${user.name},<br>
    We received a request to reset the password on your Scooby Account.</p>

    <div class="otp-container">
        <p>Your code :</p>
        <div class="otp-number">${resetCode}</div>
        <p class="otp-validity">OTP valid for 10 minutes</p>
    </div>

    <p class="reset-message">Enter this code to complete the reset. <br>
    Thanks for helping us keep your account secure. <br>
    The Scooby Team</p>

</body>
</html>

    `
    }
    try {
        transporter.sendMail(mailOptions)
    } catch (err) {
        user.passwordResetCode = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetVerified = undefined;

        await user.save()

        return next(new appError(`There is an error in sending email ${err} `, 500));
    }

    res.status(200).json({
        message: 'check your email'
    })

})
//-------------------------------------------------------------------------------------------- forget password (check code)
exports.checkforgotpasscode = catchAsync(async (req, res, next) => {
    const hashedResetCode = crypto
        .createHash('sha256')
        .update(req.body.code)
        .digest('hex');

    const user = await userModel.findOne({
        passwordResetCode: hashedResetCode,
        passwordResetExpires: { $gt: Date.now() }, //10:10 > 10:6 true    create 10:00
    });

    if (!user) {
        return next(new appError('Reset code invalid or expired'));
    }

    user.passwordResetVerified = true;
    await user.save();

    res.status(200).json({
        status: 'Success',
        message: 'Valid reset code!',
        userId: user._id
    })
})

//-------------------------------------------------------------------------------------------- forget password (reset password)
exports.getresetpass = catchAsync(async (req, res, next) => {
    //     const user=await userModel.findById(req.params.userId)
    //     //console.log(req.params.userId)
    //     //console.log(req.params.token)
    //     if(!user){
    //         return next(new appError('User not found',400))
    //     }
    //     const secret=process.env.JWT_SECRET+user.password
    //     jwt.verify(req.params.token,secret)
    //     if(req.body.password !== req.body.confirmPassword ){
    //         return next(new appError('Password and confirmation password do not match',400))
    //     }
    //     user.password=req.body.password
    //     await user.save()
    //     res.json({message:"successfully changed password"})
    // next()

    const user = await userModel.findById(req.params.userId)
    
    if (req.body.password !== req.body.confirmPassword) {
        return next(new appError('Password and confirmation password do not match', 400))
    }

    user.password = req.body.password
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save()

    res.status(200).json({
        status: "success",
    })

})
//-------------------------------------------------------------------------------------------- 

exports.sendToken = catchAsync(async (req, res) => {

    const { email, password } = req.body;
    if (!email || !password) {
        return next(new appError('please enter a valid email or password', 400))
    }
    const result = await userModel.findOne({ email })

    if (!result || !(await result.correctPassword(password, result.password))) {
        return next(new appError('Incorrect Email or Password', 401))
    }
    createSendToken(res, result, 201)
})


exports = createSendToken