const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt')
require('dotenv').config({path:'../config.env'})

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        maxlength:[10,'Maximum 10 characters'],
        minlength:[3,'Minimum 3 characters'],
        required:[true,'Please enter your first name']
    },
    lastName:{
        type:String,
        maxlength:[10,'Maximum 10 characters'],
        minlength:[3,'Minimum 3 characters']
    },
    email:{
        type:String,
        required:[true,'Please enter your email'],
        validate:[validator.isEmail,'Please enter a valid email']
    },
    password:{
        type:String,
        maxlength:[20,'Maximum 20 characters'],
        minlength:[8,'Minimum 8 characters'],
        required:[true,'Please enter your password'],
        //select : false
    },
    confirmPassword:{
        type:String,
        required:[true,'Please confirm your password'],
        validate :[function(el){return el === this.password},'Are not the same']
    }
})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) {return next()}
    const salt = Number(process.env.SALT)
    this.password = await bcrypt.hash(this.password,salt)
    this.confirmPassword = undefined
    next()
})

const userModel = mongoose.model('users',userSchema);

module.exports = userModel