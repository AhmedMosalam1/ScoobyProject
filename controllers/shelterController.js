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

  

exports.shelterIamges = (req, res, next) => {
    upload.fields([
        //{ name: 'shelterImage', maxCount: 1 },
        { name: 'shelterImages', maxCount: 5 }
    ])(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: 'Failed to upload files' });
        }

        const shelterImageFiles = req.files['shelterImage'];

        const shelterImageFile = shelterImageFiles[0];
        const shelterImageBuffer = await sharp(shelterImageFile.buffer) // Convert to buffer
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toBuffer(); // Convert to buffer

        // Upload doctorImage to Cloudinary
        const shelterImageResult = await uploadToClodinary(shelterImageBuffer, shelterImageFile.originalname, 'Scooby/Shelters');
        req.body.shelterImage = shelterImageResult.secure_url;
      
        req.body.shelterImages = [];

        await Promise.all(
            req.files.shelterImages.map(async (file, i) => {
                const filename = `shelter-${Date.now()}-${i + 1}.jpeg`;

                const imageBuffer = await sharp(file.buffer)
                    .toFormat('jpeg')
                    .jpeg({ quality: 90 })
                    .toBuffer();

                const filePath = `Scooby/Shelters`;
                const result = await uploadToClodinary(imageBuffer, filename, filePath);
               // console.log(result)

                req.body.shelterImages.push(result.secure_url);
            })
        );

        next();
    });
};




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



exports.updateshelter = catchAsync(async (req, res, next) => {
  
        const shelter = await shelterModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
      
        if (!shelter) {
            return next(new appError(`Can't find this shelter`, 404));
        }
      
      
        res.status(201).json({shelter})
    })
    //*********************************************************** */

    exports.getShelter = catchAsync(async (req, res, next) => {
  
        const shelter = await shelterModel.findById(req.params.id).populate('reviewsOfShelter')
     
        const updatedDoc = await shelterModel.findByIdAndUpdate(req.params.id, { numberOfRates: shelter.reviewsOfShelter.length }, { new: true }).populate('reviewsOfShelter')
        
      
        if (!shelter) {
            return next(new appError(`Can't find this shelter`, 404));
        }
      
      
        res.status(201).json(updatedDoc)
    })
    //*********************************************************** */
    exports.getPetsInShelter = catchAsync(async (req, res, next) => {
  
        const pets = await petsModel.find({shelterInfo:req.params.id})
     
        
        if (!pets) {
            return next(new appError(`Can't find this shelter`, 404));
        }
      
      
        res.status(201).json(pets)
    })

   
