const catchAsync = require('express-async-handler');
const userModel = require('../Models/userModel')
const appError = require("../utils/appError")
const jwt = require('jsonwebtoken')
const nodemailer=require('nodemailer')
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;


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

//-------------------------------------------------------------------------------------------- forget password (send link)
exports.sendforgotpasslink=catchAsync(async (req,res,next)=>{
    const user=await userModel.findOne({email:req.body.email})
    if(!user){
        return next(new appError('User not found',400))
    }
    const secet=process.env.JWT_SECRET+user.password
    const token=jwt.sign({email:user.email,id:user.id},secet,{
        expiresIn:'60m'
    })
    const link=`https://scoobyfamily.onrender.com/scooby/api/users/reset-password/${user.id}/${token}`;
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
        html:`<div>
        <h4>Click on the link to reset your password</h4>
        <p>${link}</p>
            </div>`
    }
    //res.json({message:'click on this link',resetpasslink:link})
    console.log(link)
    transporter.sendMail(mailOptions,function(err,success){
        if(err){
            console.log(err)
        }else{
            console.log('Email sent : ')
        }
    })
    //res.render('link-send')
    res.status(200).json({message:"check your email"})
})
//-------------------------------------------------------------------------------------------- forget password (reset password)
exports.getresetpass=catchAsync(async (req,res,next)=>{
    const user=await userModel.findById(req.params.userId)
    //console.log(req.params.userId)
    //console.log(req.params.token)
    if(!user){
        return next(new appError('User not found',400))
    }
    const secret=process.env.JWT_SECRET+user.password
    jwt.verify(req.params.token,secret)
    if(req.body.password !== req.body.confirmPassword ){
        return next(new appError('Password and confirmation password do not match',400))
    }
    user.password=req.body.password
    await user.save()
    res.json({message:"successfully changed password"})
next()
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


exports = createSendToken