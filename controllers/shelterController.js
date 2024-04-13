const catchAsync = require('express-async-handler');
const shelterModel = require('../Models/shelterModel')
const petsModel = require('../Models/petsModel')
const userModel = require("../Models/userModel")
const appError = require("../utils/appError")
const jwt = require('jsonwebtoken')
const multer = require("multer")
const cloudinary = require("../utils/cloud")
const sharp = require("sharp")
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
//-------------------------------------------------------------add shelter
exports.addShelter = catchAsync(async(req,res,next)=>{
    req.body.locations.coordinates = req.body.locations.coordinates.split(',').map(coord => parseFloat(coord.trim()));
    const shelter = await shelterModel.create(req.body)
    res.status(200).json({
        shelter
    })
})
//------------------------------------------------------------- get all shelters
exports.getAllShelters = catchAsync(async(req,res,next)=>{
    const allShelters = await shelterModel.find()
    res.status(200).json({
        allShelters
    })
})
//------------------------------------------------------------- pets in shelters
exports.petsInShelters = catchAsync(async(req,res,next)=>{
    const petsInShelters = await petsModel.find({owner:'shelter'}).populate('shelterInfo')
    res.status(200).json({
        petsInShelters
    })
})
//-------------------------------------------------------------delete shelter
exports.deleteshelter = catchAsync(async(req,res)=>{
    const shelterId = req.params.id
    const shelter = await shelterModel.find(shelterId)
    if(!shelterId){
        return next(new appError('shelter not found',400))
    }
    await shelterModel.findByIdAndDelete(shelterId)
    res.status(200).json({
        message:'shelter deleted successfully'
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

exports.uploadPhoto1 = upload.single('shelterImage') //      <-------

exports.resizePhotoProject = catchAsync(async (req, res, next) => {

    //----------------------------------------------------------------------------------------shelter image
    //console.log(req.file);
    if (!req.file) return next()

    const fileName1 = `${req.file.originalname}` 

    // const imageBuffer = await sharp(req.file.buffer)
    //     .toFormat('jpeg')
    //     .jpeg({ quality: 90 })
    //     .toBuffer()

    const filePath1 = `Scooby/shelters` //    <-------

    const result1 = await uploadToClodinary(req.file.buffer, fileName1, filePath1) //
    req.body.shelterImage = result1.secure_url //    <-------

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
