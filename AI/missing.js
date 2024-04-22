const axios = require("axios");
const catchAsync = require("express-async-handler");
const appError = require("../utils/appError");
const cloudinary = require("../utils/cloud");
const FoundedModel = require('../Models/foundedModel')
const multer = require("multer");
const sharp = require("sharp");

let image;
//------------------------------------------------------------- upload image
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(new appError("not an image ! please upload only images..", 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

exports.uploadPhoto = upload.single("petImage");

exports.resizePhotoProject = catchAsync(async (req, res, next) => {
    if (!req.file) return next();
    req.body.petImage = `${req.file.originalname}`;

    const imageBuffer = await sharp(req.file.buffer)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toBuffer();

    const filePath = `Scooby/Missing/Missed`;
    const fileName = req.body.petImage;

    const result = await uploadToClodinary(imageBuffer, fileName, filePath);
    req.body.petImage = result.secure_url;
    image = req.body.petImage;

    console.log('image after upload...')
    console.log(image);
    console.log('----------------------')
    next();
});

const uploadToClodinary = (buffer, filename, folderPath, options = {}) => {
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
//------------------------------------------------------------- classification
async function getClassificationResult(imageUrl) {
    try {
        const response = await axios.get(
            `https://scoopy-ai-api.onrender.com/clssification?image=${encodeURIComponent(
                imageUrl
            )}`
        );
        return response.data;
    } catch (error) {
        return new appError("Error in classification function");
    }
}
//------------------------------------------------------------- similarity
async function getSimilarityDistance(file1Url, file2Url) {
    try {
        const response = await axios.get(
            `https://scoopy-ai-api.onrender.com/distance?file1=${encodeURIComponent(
                file1Url
            )}&file2=${encodeURIComponent(file2Url)}`
        );
        return response.data;
    } catch (error) {
        return new appError("Error in similarity function");
    }
}
//------------------------------------------------------------- get founded pets
cloudinary.config({
    cloud_name: "dtny7jzz1",
    api_key: "483257938298228",
    api_secret: "p3M8L2MC4VTpYo0IVXWQV7lf2XA",
});
//------------------------------------------------------------- Missing
exports.missing = catchAsync(async (req, res, next) => {
    console.log("Start....");

    // Classify the image
    const classificationResult = await getClassificationResult(image);
    console.log(classificationResult.Calss);
    console.log("--------------------");

    // Check classification result
    if (!classificationResult.Calss) {
        return next(new appError("Please enter image again", 404));
    } else if (classificationResult.Calss === "other") {
        return next(new appError("Please send an image of a dog or cat only, or try entering another image", 404));
    }

    try {
        // Get founded pets from cloudinary
        const result = await cloudinary.api.resources({ type: "upload", prefix: "Scooby/Missing/Founded" });
        const foundedPets = result.resources.map(obj => obj.secure_url);

        console.log(foundedPets);
        console.log("--------------------");

        // Calculate similarity for each founded pet
        let similarityArray = [];

        for (let i = 0; i < foundedPets.length; i++) {
            let similarity ;
            while(!similarity){
                similarity = await getSimilarityDistance(image, foundedPets[i]);
            }
            let user = await FoundedModel.find({petImage:foundedPets[i]})
            let userId = user.userId
            let description = user.description
            console.log(similarity.Similarity)
            console.log(user)
            console.log("--------------------");
            similarityArray.push({ similarity:similarity.Similarity , url: foundedPets[i] , description , userId });
        }

        // Sort similarity array based on similarity value
        similarityArray.sort((a, b) => b.similarity.Similarity - a.similarity.Similarity);

        console.log("--------------------");

        // Send similarity array as response
        res.status(200).json({ similarityArray: similarityArray.slice(0, 2) });

        console.log("End......");
    } catch (err) {
        return next(new appError("Error in processing the request", 500));
    }
});


