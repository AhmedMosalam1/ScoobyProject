const Offer = require("../Models/offerModels")
const catchAsync = require('express-async-handler');
const appError = require("../utils/appError")
const multer = require("multer")
const cloudinary = require("../utils/cloud")
const sharp = require("sharp")
const fs = require("fs")

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

exports.uploadPhoto = upload.single('offerImage')

exports.resizePhotoProject = catchAsync(async (req, res, next) => {

    //console.log(req.file);

    if (!req.file) return next()


    const fileName = `${req.file.originalname}`

    // const imageBuffer = await sharp(req.file.buffer)
    // .jpeg({ quality: 90 }) // Adjust quality as needed (0 to 100)
    // // or use .png() if you prefer PNG format
    // .toBuffer();

    const filePath = `Scooby/Offers`

    const result = await uploadToClodinary(req.file.buffer, fileName, filePath)
    req.body.offerImage = result.secure_url

    //Purina Felix As Good as it Looks Wet Cat Food Pouch 85 g

    // await sharp(req.file.buffer)
    //     .toFormat('jpeg')
    //     .jpeg({ quality: 90 })
    //     .toFile(`upload/${req.body.imageCover}`)

    //     const inputBuffer = req.file.buffer;

    // // Create a circular mask with a radius of 24
    // const maskBuffer = Buffer.alloc(500 * 500).fill(0);
    // for (let y = 0; y < 500; y++) {
    //     for (let x = 0; x < 500; x++) {
    //         if ((x - 250) ** 2 + (y - 250) ** 2 <= 24 ** 2) {
    //             maskBuffer[y * 500 + x] = 255;
    //         }
    //     }
    // }

    // // Apply the circular mask to the image to create rounded corners
    // const roundedImageBuffer = await sharp(inputBuffer)
    //     .resize(500, 500) // Resize the image if needed
    //     .composite([{
    //         input: {
    //             // Create a buffer containing the mask
    //             create: {
    //                 width: 500,
    //                 height: 500,
    //                 channels: 4, // Set channels to 4 for an RGBA image
    //                 background: { r: 255, g: 255, b: 255, alpha: 0 },
    //                 raw: {
    //                     width: 500,
    //                     height: 500,
    //                     channels: 1,
    //                     data: maskBuffer
    //                 }
    //             }
    //         },
    //         blend: 'dest-in'
    //     }])
    //     .toBuffer();

    //     const tempFilePath = 'rounded_image.png'; // Provide a temporary file path
    //     fs.writeFileSync(tempFilePath, roundedImageBuffer);

    //     // Upload the file to Cloudinary
    //     const result = await cloudinary.uploader.upload(tempFilePath, {
    //         folder: 'Scooby/Offers',
    //         crop: 'fill',
    //     });

    //     // Delete the temporary file
    //     fs.unlinkSync(tempFilePath);

    //     req.body.offerImage = result.secure_url;


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
    const doc = await Offer.create(req.body)
    res.status(201).json({
        status: "success",
        data: {
            data: doc
        }
    })
})

exports.getAll = catchAsync(async (req, res) => {
    let obj={}
    if(req.query.type){
        obj={type:req.query.type}
    }
    const documents = await Offer.find(obj);

    res
        .status(200)
        .json({ results: documents.length, data: documents });
});


