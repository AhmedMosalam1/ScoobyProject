const catchAsync = require('express-async-handler');
const userModel = require('../models/userModel')
const appError = require("../utils/appError")

exports.createSendToken = (res, result, statusCode) => {
  
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

  //---------------------------------------------------------------------------

exports.signup = catchAsync(async (req,res)=>{
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

//-----------------------------------------------------------------------------------------

exports.login = catchAsync(async(req,res)=>{
    
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

//------------------------------------------------------------------------------------------

exports.logout = catchAsync(async (req, res) => {
    req.logOut();
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() - 1 * 1000),
        httpOnly: true
    });
    res.status(200).json({ status: 'success' });
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