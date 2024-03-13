const Vet = require("../Models/vetModel") //error
const catchAsync = require('express-async-handler');
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

exports.uploadPhoto = upload.single('vetImage')

exports.resizePhotoProject = catchAsync(async (req, res, next) => {

    if (!req.file) return next()

    const fileName = `${req.file.originalname}`

    const filePath = `Scooby/Vets`

    const result = await uploadToClodinary(req.file.buffer, fileName, filePath)
    req.body.vetImage = result.secure_url

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


exports.createOne=catchAsync(async(req,res,next)=>{

    req.body.locations.coordinates = req.body.locations.coordinates.split(',').map(coord => parseFloat(coord.trim()));

    const doc=await Vet.create(req.body)

    res.status(201).json({
        status:'success',
        data:doc
    })

})


exports.deleteOne = catchAsync(async (req, res, next) => {
    const id = req.params.id

    const doc = await Vet.findById(id)

    if (!doc) {
        return next(new appError(`Can't find Vet on this id`, 404));
    }

    await doc.remove()

    res.status(201).json({
        status: "deleted success",
    })
})

exports.deleteAll = catchAsync(async (req, res, next) => {

    await Vet.deleteMany()

    res.status(201).json({
        status: "Delete All Successfully",
    })
})

exports.getOne = catchAsync(async (req, res, next) => {
    const id = req.params.id

    let doc = await Vet.findById(id)

    if (!doc) {
        return next(new appError(`Can't find Vet on this id`, 404));
    }

    res.status(201).json({
        status: "success",
        data: {
            data: doc
        }
    })
})

exports.updateOne = catchAsync(async (req, res, next) => {
    
    const doc = await Vet.findByIdAndUpdate(req.user.id, req.body, { new: true }) //new is true => to return new doc after update

    if (!doc) {
        return next(new appError(`Can't find Vet on this id`, 404));
    }

   // doc.save()

    res.status(201).json({
        status: "success",
        data: {
            data: doc
        }
    })
})


exports.getAll = catchAsync(async (req, res) => {

    const documents = await Vet.find();

    res
        .status(200)
        .json({ results: documents.length, data: documents });
});


