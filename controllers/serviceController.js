const catchAsync = require('express-async-handler');
const serviceModel = require('../Models/serviceModel')
const userModel = require('../Models/userModel')
const appError = require("../utils/appError")
const jwt = require('jsonwebtoken')
const nodemailer=require('nodemailer')
const multer = require("multer")
const cloudinary = require("../utils/cloud")
const sharp = require("sharp")
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

//-------------------------------------------------------------create service
exports.createService = catchAsync(async(req,res)=>{
    const service = await serviceModel.create(req.body)
    const user = await userModel.findById(req.params.id)
    user.services_id.push(service.id)
    await user.save();
    res.status(200).json({
        service
    })
    
})
//-------------------------------------------------------------get all services
exports.getAllServices = catchAsync(async(req,res)=>{
    const allServices = await serviceModel.find()
    res.status(200).json({
        // image : allServices.serviceImage,
        // type : allServices.serviceType ,
        // rate: allServices.rate ,
        // country : allServices.country ,
        // price : allServices.price ,
        allServices
    })
    
})
//------------------------------------------------------------- filter - Pet Boarding
exports.getPetBoarding = catchAsync(async(req,res)=>{
    const PetBoarding = await serviceModel.find({serviceType:"Pet Boarding"})
    res.status(200).json({
        PetBoarding
    })
    
})
//-------------------------------------------------------------filter - Pet Hotel
exports.getPetHotel = catchAsync(async(req,res)=>{
    const petHotel = await serviceModel.find({serviceType:"Pet Hotel"})
    res.status(200).json({
        petHotel
    })
    
})
//-------------------------------------------------------------filter - Dog Walking
exports.getDogWalking = catchAsync(async(req,res)=>{
    const dogWalking = await serviceModel.find({serviceType:"Dog Walking"})
    res.status(200).json({
        dogWalking
    })
    
})
//-------------------------------------------------------------filter - Grooming
exports.getGrooming = catchAsync(async(req,res)=>{
    const grooming = await serviceModel.find({serviceType:"Grooming"})
    res.status(200).json({
        grooming
    })
    
})
//-------------------------------------------------------------filter - Pet Taxi
exports.getPetTaxi = catchAsync(async(req,res)=>{
    const petTaxi = await serviceModel.find({serviceType:"Pet Taxi"})
    res.status(200).json({
        petTaxi
    })
    
})
//-------------------------------------------------------------filter - Dog Training
exports.getDogTraining = catchAsync(async(req,res)=>{
    const dogTraining = await serviceModel.find({serviceType:"Dog Training"})
    res.status(200).json({
        dogTraining
    })
    
})
//-------------------------------------------------------------upload images
const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true)
    } else {
        cb(new appError('not an image ! please upload only images..', 400), false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

    // await sharp(req.files.projectImage[0].buffer)
    //     .toFormat('jpeg')
    //     .jpeg({ quality: 90 })
    //     .toFile(`upload/project/${req.body.imageCover}`)

    // const result1 = await cloudinary.uploader.upload(`upload/project/${req.body.imageCover}`, {
    //     public_id: `${Date.now()}_Cover`,
    //     crop: 'fill',
    // });

exports.uploadPhoto1 = upload.single('serviceImage')
//exports.uploadPhoto2 = upload.single('carImage')
//exports.uploadPhoto3 = upload.single('licenseImage') // //      <-------

exports.resizePhotoProject = catchAsync(async (req, res, next) => {

    //----------------------------------------------------------------------------------------service image
    console.log(req.file);
    if (!req.file) return next()

    const fileName1 = `${req.file.originalname}` //

    // const imageBuffer = await sharp(req.file.buffer)
    //     .toFormat('jpeg')
    //     .jpeg({ quality: 90 })
    //     .toBuffer()

    const filePath1 = `Scooby/services/services` // //     <-------

    const result1 = await uploadToClodinary(req.file.buffer, fileName1, filePath1) //
    req.body.serviceImage = result1.secure_url // //      <-------
    //----------------------------------------------------------------------------------------car image
    // console.log(req.file);
    // if (!req.file) return next()

    // const fileName2 = `${req.file.originalname}` //

    // // const imageBuffer = await sharp(req.file.buffer)
    // //     .toFormat('jpeg')
    // //     .jpeg({ quality: 90 })
    // //     .toBuffer()

    // const filePath2 = `Scooby/services/cars` // //     <-------

    // const result2 = await uploadToClodinary(req.file.buffer, fileName2, filePath2) //
    // req.body.carImage = result2.secure_url // // 
    //----------------------------------------------------------------------------------------license image
    // console.log(req.file);
    // if (!req.file) return next()

    // const fileName3 = `${req.file.originalname}` //

    // // const imageBuffer = await sharp(req.file.buffer)
    // //     .toFormat('jpeg')
    // //     .jpeg({ quality: 90 })
    // //     .toBuffer()

    // const filePath3 = `Scooby/services/licenses` // //     <-------

    // const result3 = await uploadToClodinary(req.file.buffer, fileName3, filePath3) //
    // req.body.licenseImage = result3.secure_url // // 

    next()
})

const uploadToClodinary = (buffer, filename, folderPath, options = {}) => {
    return new Promise((resolve, reject) => {
        options.folder = folderPath;
        options.public_id = filename;

        const uploadStream = cloudinary.uploader.upload_stream(
            options,
            (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result)
                }
            }
        )
        uploadStream.end(buffer)
    })
}
