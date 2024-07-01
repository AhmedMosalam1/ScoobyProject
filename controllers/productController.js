const Product = require("../Models/productsModel")
const catchAsync = require('express-async-handler');
const appError = require("../utils/appError")
const multer = require("multer")
const cloudinary = require("../utils/cloud")
const sharp = require("sharp")

exports.deleteOne = catchAsync(async (req, res, next) => {
    const id = req.params.id

    const doc = await Product.findById(id)

    if (!doc) {
        return next(new appError(`Can't find Product on this id`, 404));
    }

    await doc.remove()

    res.status(201).json({
        status: "deleted success",
    })
})

exports.deleteAll = catchAsync(async (req, res, next) => {
    const id = req.params.id

    await Product.findByIdAndDelete(id)

    res.status(201).json({
        status: "Delete All Successfully",
    })
})

exports.getOne = catchAsync(async (req, res, next) => {
    const id = req.params.id

    let doc = await Product.findById(id)

    if (!doc) {
        return next(new appError(`Can't find Product on this id`, 404));
    }

    res.status(201).json({
        status: "success",
        data: {
            data: doc
        }
    })
})

exports.updateOne = catchAsync(async (req, res, next) => {

    const doc = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }) //new is true => to return new doc after update

    if (!doc) {
        return next(new appError(`Can't find Product on this id`, 404));
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

exports.uploadPhoto = upload.single('productImage')

exports.resizePhotoProject = catchAsync(async (req, res, next) => {

    //console.log(req.file);

    if (!req.file) return next()


    const fileName = `${req.file.originalname}`

    // const imageBuffer = await sharp(req.file.buffer)
    //     .toFormat('jpeg')
    //     .jpeg({ quality: 90 })
    //     .toBuffer()

    const filePath = `Scooby/Products`

    const result = await uploadToClodinary(req.file.buffer, fileName, filePath)
    req.body.productImage = result.secure_url

    next()
})


const uploadToClodinary = (buffer, filename, folderPath, options = {}) => {
    return new Promise((resolve, reject) => {
        options.folder = folderPath;
        options.public_id = filename;
        options.quality = "auto:best";
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
    //console.log(req.body);
    const doc = await Product.create(req.body)
    res.status(201).json({
        status: "success",
        data: {
            data: doc
        }
    })
})

exports.getAll = catchAsync(async (req, res) => {
    let obj = {};

    if (req.query.category) {
        obj = { category: req.query.category };
    }

    if (req.query.page) {
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 12;
        let skip = (page - 1) * limit;


        const totalCount = await Product.countDocuments(obj);

        const documents = await Product.find(obj).skip(skip).limit(limit);
    const a = req.headers.authorization
        console.log(a);
        return res.status(200).json({
            status: 'success',
            results: documents.length,
            totalResults: totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            data: documents
        });
    }

    const documents = await Product.find(obj)

    res.status(200).json({
        status: 'success',
        results: documents.length,
        data: documents
    });
})

exports.getProductBySearch = catchAsync(async (req, res) => {

    const documents = await Product.find({
        $or: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { desc: { $regex: req.query.search, $options: 'i' } }
        ]
    });    

    res
        .status(200)
        .json({ results: documents.length, data: documents });
});







