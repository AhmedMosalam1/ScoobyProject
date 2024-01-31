const jwt = require('jsonwebtoken')
const express = require('express')
const bcrypt = require('bcrypt')
const userModel = require('../Models/userModel')
const nodemailer=require('nodemailer')
//const catchAsync
//const AppError

const app = express();
app.use(express.json());



const signup = async (req,res)=>{
    try{
        const email_exist = req.body.email
        const user_exist = await userModel.findOne({email:email_exist})
        if(!user_exist){
            const newUser = await userModel.create(req.body);
            const token = jwt.sign({id:newUser._id} , process.env.JWT_SECRET)
            res.status(200).json({
                Message:'User added successfully 🤍',
                Token : token ,
                User : {newUser}
            })
        }
        else{
            res.status(401).json({
                Message:'Email is aready exist'
            })
        }
    }
    catch(err){
        res.status(400).json({
            error:err
        })
    }
}
//-----------------------------------------------------------------------------------------
const login = async(req,res)=>{
    try{
        const {email,password} = req.body ;
        if(!email || !password){
            return res.status(401).json({
                Message:'please fill email and password',
            })
        }
        const user_exist = await userModel.findOne({email})
        if(!user_exist){
            return res.status(401).json({
                Message:'please enter a valid email',
            })
        }
        if(!await bcrypt.compare(password,user_exist.password)){
            return res.status(401).json({
                Message:'Wrong password',
            })
        }
        const token = jwt.sign({id:user_exist._id} , process.env.JWT_SECRET)
        return res.status(201).json({
            Message:'logged in successfully 🤍',
            Token : token ,
            User : {user_exist}
        })
    }catch(err){
        res.status(400).json({
            err:err
        })
    }
    
}
//-------------------------------------
const getforgotpass=async (req,res)=>{
    res.render('forgot-pass')
}
//-------------------------------------
const sendforgotpasslink=async (req,res,next)=>{
    const user=await userModel.findOne({email:req.body.email})
    console.log(req.body.email)
    if(!user){
        return res.status(404).json({
            message:"user not found"
        })
    }
    const secet=process.env.JWT_SECRET+user.password
    const token=jwt.sign({email:user.email,id:user.id},secet,{
        expiresIn:'60m'
    })
    const link=`http://localhost:3000/scooby/api/users/reset-password/${user.id}/${token}`;
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
    transporter.sendMail(mailOptions,function(err,success){
        if(err){
            console.log(err)
        }else{
            console.log('Email sent : ')
        }
    })
    //res.render('link-send')
    res.json({message:"check your email"})
    next()
}
//---------------------------------------------
const getresetpassview=async (req,res,next)=>{
    const user=await userModel.findById(req.params.userId)
    //console.log(req.body.email)
    if(!user){
        return res.status(404).json({
            message:"user not found"
        })
    }
    const secet=process.env.JWT_SECRET+user.password
    
    try{
        jwt.verify(req.params.token,secet)
        res.render('reset-pass',{email:user.email})
    }catch(err){
        console.log(err)
        res.json({message:"Error"})
    }
    
    next()
}

const getresetpass=async (req,res,next)=>{
    const user=await userModel.findById(req.params.userId)
    //console.log(req.params.userId)
    //console.log(req.params.token)
    if(!user){
        return res.status(404).json({
            message:"user not found"
        })
    }
    const secet=process.env.JWT_SECRET+user.password
    
    try{
        
        jwt.verify(req.params.token,secet)
        

        user.password=req.body.password
        user.confirmPassword=req.body.confirmPassword
       // console.log(user.password)
        await user.save()
        //return res.render('success-pass')
        res.json({message:"successfully changed password"})
        res.sen
    }catch(err){
        console.log(err)
        return res.json({message:"Error"})
    }
    
    next()
}




module.exports = {signup,login,getforgotpass,sendforgotpasslink,getresetpassview,getresetpass}