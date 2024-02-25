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

exports.uploadPhoto = upload.single('serviceImage')

exports.resizePhotoProject = catchAsync(async (req, res, next) => {

    console.log(req.file);

    if (!req.file) return next()


    const fileName = `${req.file.originalname}`

    // const imageBuffer = await sharp(req.file.buffer)
    //     .toFormat('jpeg')
    //     .jpeg({ quality: 90 })
    //     .toBuffer()

    const filePath = `Scooby/services/services`

    const result = await uploadToClodinary(req.file.buffer, fileName, filePath)
    req.body.serviceImage = result.secure_url

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
