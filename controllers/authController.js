const catchAsync = require('express-async-handler');
const {promisify}=require('util')

const userModel = require('../Models/userModel')
const appError = require("../utils/appError")
const jwt = require('jsonwebtoken')
const nodemailer=require('nodemailer')
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

exports.signup = catchAsync(async (req,res,next)=>{
        const email_exist = req.body.email
        const user_exist = await userModel.findOne({email:email_exist})
        if(!user_exist){
            const result = await userModel.create(req.body);
            createSendToken(res, result, 200)
        }
        else{
            return next(new appError('Email is Already Exist', 401))
        }
})

//----------------------------------------------------------------------------------------- log in 

exports.login = catchAsync(async(req,res,next)=>{
    
        const {email,password} = req.body;
        if(!email || !password){
            return next(new appError('please enter a valid email or password', 400))
        }
        const result = await userModel.findOne({email})
        
        if(!result || !(await result.correctPassword(password, result.password))){
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
let code 
exports.sendforgotpasscode=catchAsync(async (req,res,next)=>{
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
    user=await userModel.findOne({email:req.body.email})
    if(!user){
        return next(new appError('User not found',400))
    }
    code = user.getRandomNumber(100000,999999)
    const transporter=nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.USER_EMAIL,
            pass:process.env.USER_PASS
        }
    })
    const mailOptions={
        from:process.env.USER_EMAIL,
        to:user.email,
        subject:'reset password',
        // html:`<div>
        // <h4>Your Code</h4>
        // <p>${code}</p>
        //     </div>`
        html:`<head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cool OTP Display</title>
        <style>
            body {
                background-color: #282c35;
                color: #ffffff;
                font-family: 'Arial', sans-serif;
                text-align: center;
                padding: 50px;
                margin: 0;
            }
    
            h1 {
                color: #4733ab;
            }
    
            .otp-container {
                border: 2px solid #4733ab;
                padding: 20px;
                border-radius: 10px;
                background-color: #1e1e1e;
                margin-top: 20px;
                display: inline-block;
            }
    
            .otp-number {
                font-size: 24px;
                letter-spacing: 8px;
                margin: 10px 0;
                color: #4733ab;
            }
    
            p {
                font-size: 18px;
            }
        </style>
    </head>
    <body>
    
        <h1>Scooby Family</h1>
    
        <div class="otp-container">
            <p>Your code :</p>
            <div class="otp-number">${code}</div>
        </div>
    
    </body>`
    }
    transporter.sendMail(mailOptions,function(err,success){
        if(err){
            console.log(err)
        }
    })
    res.status(200).json({
        message : 'check your email'
    })
})
//-------------------------------------------------------------------------------------------- forget password (check code)
exports.checkforgotpasscode=catchAsync(async (req,res,next)=>{
    const userCode = Number(req.body.code);
    if(code === userCode){
        res.status(200).json({
            userId : user._id
        })
    }else{
        return next(new appError('Invalid code',400)) 
    }
})
//-------------------------------------------------------------------------------------------- forget password (reset password)
exports.getresetpass=catchAsync(async (req,res,next)=>{
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

    const user=await userModel.findById(req.params.userId)
    if(req.body.password !== req.body.confirmPassword ){
        return next(new appError('Password and confirmation password do not match',400))
    }
    user.password=req.body.password
    await user.save()
    res.json({message:"successfully changed password"})

})
//-------------------------------------------------------------------------------------------- 

exports.sendToken = catchAsync(async(req,res)=>{
    
    const {email,password} = req.body;
    if(!email || !password){
        return next(new appError('please enter a valid email or password', 400))
    }
    const result = await userModel.findOne({email})
    
    if(!result || !(await result.correctPassword(password, result.password))){
        return next(new appError('Incorrect Email or Password', 401))
    }
    createSendToken(res, result, 201)
})


exports.protect=catchAsync(async(req,res,next)=>{
    //1)getting token and check if it exist
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){

        token=req.headers.authorization.split(' ')[1];

    }else if(req.cookies.jwt){
        token=req.cookies.jwt
    }
    //console.log(token)

    if(!token){
        return next(new appError('you are not logged! please login ',401))
    }
    //2)verification token
    const decoded=await promisify(jwt.verify)(token,process.env.JWT_SECRET)
    console.log(decoded)



    //3)check if user still exist 
    const currentuser=await userModel.findById(decoded.id);
    if(!currentuser){
        return next(new appError('the user belonging to this token doesnt exist  ',401))

    }

    //4)check if user change pass after the jwt issed
    
    // accsess to protected rout 
    req.user=currentuser
    next()
})



exports = createSendToken