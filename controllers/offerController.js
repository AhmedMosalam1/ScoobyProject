const Offer = require("../models/offerModels")
const catchAsync = require('express-async-handler');
const appError = require("../utils/appError")
const multer = require("multer")
const cloudinary = require("../utils/cloud")
const sharp = require("sharp")

exports.deleteOne = catchAsync(async (req, res, next) => {
    const id = req.params.id

    const doc = await Offer.findById(id)

    if (!doc) {
        return next(new appError(`Can't find Offer on this id`, 404));
    }

    await doc.remove()

    res.status(201).json({
        status: "deleted success",
    })
})

exports.deleteAll = catchAsync(async (req, res, next) => {
    const id = req.params.id

    await Offer.findByIdAndDelete(id)

    res.status(201).json({
        status: "Delete All Successfully",
    })
})

exports.getOne = catchAsync(async (req, res, next) => {
    const id = req.params.id

    let doc = await Offer.findById(id)

    if (!doc) {
        return next(new appError(`Can't find Offer on this id`, 404));
    }

    res.status(201).json({
        status: "success",
        data: {
            data: doc
        }
    })
})

exports.updateOne = catchAsync(async (req, res, next) => {

    const doc = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true }) //new is true => to return new doc after update

    if (!doc) {
        return next(new appError(`Can't find Offer on this id`, 404));
    }

    doc.save()

    res.status(201).json({
        status: "success",
        data: {
            data: doc
        }
    })
})




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

exports.uploadPhoto = upload.single('offerImage')

exports.resizePhotoProject = catchAsync(async (req, res, next) => {

    console.log(req.file);

    if (!req.file) return next()


    const fileName = `${req.file.originalname}`

    // const imageBuffer = await sharp(req.file.buffer)
    //     .toFormat('jpeg')
    //     .jpeg({ quality: 90 })
    //     .toBuffer()

    const filePath = `Scooby/Offers`

    const result = await uploadToClodinary(req.file.buffer, fileName, filePath)
   
    req.body.offerImage = result.secure_url

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


exports.createOne = catchAsync(async (req, res, next) => {
    const doc = await Offer.create(req.body)
    res.status(201).json({
        status: "success",
        data: {
            data: doc
        }
    })
})

exports.getAll = catchAsync(async (req, res) => {

    const documents = await Offer.find();

    res
        .status(200)
        .json({ results: documents.length, data: documents });
});


