const axios = require("axios");
const catchAsync = require("express-async-handler");
const appError = require("../utils/appError");
const cloudinary = require("../utils/cloud");
const FoundedModel = require("../Models/foundedModel");
const multer = require("multer");
const sharp = require("sharp");
const resemble = require("resemblejs");

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

    console.log("image after upload...");
    console.log(image);
    console.log("----------------------");
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
        // تحميل الصور من URLs وتحويلها إلى Buffers
        const response1 = await axios.get(file1Url, { responseType: 'arraybuffer' });
        const response2 = await axios.get(file2Url, { responseType: 'arraybuffer' });

        const buffer1 = Buffer.from(response1.data, 'binary');
        const buffer2 = Buffer.from(response2.data, 'binary');

        // استخدام resemble لمقارنة الصور
        return new Promise((resolve, reject) => {
            resemble(buffer1)
                .compareTo(buffer2)
                .onComplete((data) => {
                    resolve(data);
                });
        });
    } catch (error) {
        console.error(error);
        throw new appError("Error in similarity function");
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

    //Classify the image
    const classificationResult = await getClassificationResult(image);
    //console.log(classificationResult.Calss);
    console.log(classificationResult.Calss);
    console.log("--------------------");

    // Check classification result
    if (!classificationResult) {
        return next(new appError("Please enter image again", 404));
    } else if (classificationResult.Calss === "other") {
        return next(
            new appError(
                "Please send an image of a dog or cat only, or try entering another image",
                404
            )
        );
    } else {
        try {
            //Get founded cats from cloudinary
            let result;
            if(classificationResult.Calss === "Cat"){
                result = await cloudinary.api.resources({
                    type: "upload",
                    prefix: "Scooby/Missing/Founded/Cats",
                });
            } else if(classificationResult.Calss === "Dog"){
                result = await cloudinary.api.resources({
                    type: "upload",
                    prefix: "Scooby/Missing/Founded/Dogs",
                });
            }

            const foundedPets = result.resources.map((obj) => obj.secure_url);

            console.log(foundedPets);
            console.log("--------------------");

            // Calculate similarity for each founded pet
            let similarityArray = [];

            for (let i = 0; i < foundedPets.length; i++) {
                let similarity = await getSimilarityDistance(image, foundedPets[i]);

                let user = await FoundedModel.find({ petImage: foundedPets[i] }).populate('userId');
                let userId = user[0].userId;
                let description = user[0].description;
                let location = user[0].locations;
                let phoneNumber = user[0].phoneNumber;
                let createdAt = user[0].createdAt;
                console.log(similarity);
                console.log(user[0]);
                console.log("--------------------");
                similarityArray.push({
                    similarity: 100 - similarity.rawMisMatchPercentage,
                    url: foundedPets[i],
                    description,
                    userId,
                    location,
                    phoneNumber,
                    createdAt
                });
            }
            let sortedSimilarityArray = similarityArray.sort((a, b) => b.similarity - a.similarity);
            console.log(sortedSimilarityArray);
            console.log("--------------------");
            res.status(200).json({ similarityArray: sortedSimilarityArray.slice(0, 2) });
            console.log("End......");
        } catch (err) {
            return next(new appError("Error in processing the request", 500));
        }
    }
});
