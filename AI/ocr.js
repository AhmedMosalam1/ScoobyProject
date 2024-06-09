const axios = require("axios");
const catchAsync = require("express-async-handler");
const appError = require("../utils/appError");
const cloudinary = require("../utils/cloud");
const multer = require("multer");
const sharp = require("sharp");
const productModel = require('../Models/productsModel')

let image
//------------------------------------------------------------- upload image
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(new appError("not an image! Please upload only images..", 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

exports.uploadPhoto = upload.single("image");

exports.resizePhotoProject = catchAsync(async (req, res, next) => {
    if (!req.file) return next();
    req.body.image = `${req.file.originalname}`;

    const imageBuffer = await sharp(req.file.buffer)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toBuffer();

    const filePath = `Scooby/Draft`;
    const fileName = req.file.originalname;

    const result = await uploadToCloudinary(imageBuffer, fileName, filePath);
    req.body.image = result.secure_url;
    image = req.body.image

    console.log("image after upload...");
    console.log(image);
    console.log("----------------------");
    next();
});

const uploadToCloudinary = (buffer, filename, folderPath, options = {}) => {
    return new Promise((resolve, reject) => {
        options.folder = folderPath;
        options.public_id = filename;
        const uploadStream = cloudinary.uploader.upload_stream(
            options,
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
        uploadStream.end(buffer);
    });
};

//----------------------------------------------------------------- OCR   

async function getOcrResult(imageUrl) {
    try {
        const response = await axios.get(
            `https://scoopy-ai-api.onrender.com/ocr?image=${encodeURIComponent(
                imageUrl
            )}`
        );
        return response.data;
    } catch (error) {
        return new appError("Error in classification function");
    }
}
//----------------------------------------------------------------- OCR   
exports.ocr = catchAsync(async (req, res, next) => {
    console.log("Start....");
    const ocrResult = await getOcrResult(image);
    let finalResult = ocrResult.Text.split('\n')
    console.log("----------------------");
    console.log(finalResult);
    console.log("----------------------");
    finalResult = finalResult.map(word => {
        const wordArray = word.split(' ');
        const capitalizedWordArray = wordArray.map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
        });
        return capitalizedWordArray.join(' ');
    });
    console.log(finalResult);
    console.log("----------------------");
    const products = await Promise.all(finalResult.map(async (element) => {
        let product = await productModel.findOne({ name: element });
        return product;
    }));
    //console.log(products);
    //console.log("----------------------");
    res.status(200).json({products})


    next();
});
