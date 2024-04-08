const catchAsync = require('express-async-handler');
const doctormodel = require('../Models/doctorModel')
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

exports.uploadPhoto = upload.single('doctorImage')


exports.resizePhotoProject = catchAsync(async (req, res, next) => {

    //console.log(req.file);

    if (!req.file) return next()
    console.log("object");

    req.body.doctorImage= `${req.file.originalname}`


    const imageBuffer = await sharp(req.file.buffer)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toBuffer()

    const filePath = `Scooby/Doctors`
    const fileName = req.body.doctorImage

    const result = await uploadToClodinary(imageBuffer, fileName, filePath)
    //console.log(result)

    req.body.doctorImage = result.secure_url

    next()
})






//****************************************************************** */
exports.createdoctor=catchAsync(async(req,res,next)=>{

    const newdoctor=await doctormodel.create(req.body)
    res.status(201).json({
        status:'success',
        data:newdoctor
    })

})
/************************************************************** */

exports.getdoctors=catchAsync(async(req,res,next)=>{

   

    const doctors=await doctormodel.find()   
 if(doctors){
    res.status(200).json({
        status:'success',
          data:doctors
      })

 }else{
   
        return next(new appError ('empty doctors', 401))
    
 }
    
  }
    
  
    )




/************************************************************************* */
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


