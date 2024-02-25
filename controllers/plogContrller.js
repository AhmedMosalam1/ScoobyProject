const catchAsync = require('express-async-handler');
const plogModel = require('../models/plogModel')
const appError = require("../utils/appError")
const multer = require("multer")
const cloudinary = require("../utils/cloud")
const sharp = require("sharp")


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

exports.uploadPhoto = upload.single('plogImage')


exports.resizePhotoProject = catchAsync(async (req, res, next) => {

    //console.log(req.file);

    if (!req.file) return next()
    console.log("object");

    req.body.plogImage= `${req.file.originalname}`


    const imageBuffer = await sharp(req.file.buffer)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toBuffer()

    const filePath = `F:\Graduation\ScoobyPlogImage`
    const fileName = req.body.plogImage

    const result = await uploadToClodinary(imageBuffer, fileName, filePath)
    //console.log(result)

    req.body.plogImage = result.secure_url

    next()
})










exports.createPlog=catchAsync(async(req,res,next)=>{

    const newplog=await plogModel.create(req.body)
    res.status(201).json({
        status:'success',
        data:newplog
    })

})
exports.getplogs=catchAsync(async(req,res,next)=>{

   

    const Plogs=await plogModel.find()   
 if(Plogs){
    res.status(200).json({
        status:'success',
          data:Plogs
      })

 }else{
   
        return next(new appError ('plog should be exist', 401))
    
 }
    
  }
    
  
    )


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


