const axios = require("axios");
const catchAsync = require("express-async-handler");
const appError = require("../utils/appError");
const cloudinary = require("../utils/cloud");
const FoundedModel = require("../Models/foundedModel");
const multer = require("multer");
const sharp = require("sharp");
//const resemble = require("resemblejs");

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

    const result = await uploadToCloudinary(imageBuffer, fileName, filePath);
    req.body.petImage = result.secure_url;
    image = req.body.petImage;

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
        const response1 = await axios.get(file1Url, { responseType: 'arraybuffer' });
        const response2 = await axios.get(file2Url, { responseType: 'arraybuffer' });

        const buffer1 = Buffer.from(response1.data, 'binary');
        const buffer2 = Buffer.from(response2.data, 'binary');

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

// Function to get all resources with pagination
async function getAllResources(options, resources = []) {
    try {
        const result = await cloudinary.api.resources(options);
        resources = resources.concat(result.resources);

        if (result.next_cursor) {
            options.next_cursor = result.next_cursor;
            return await getAllResources(options, resources);
        } else {
            return resources;
        }
    } catch (error) {
        throw new appError("Error fetching resources from Cloudinary", 500);
    }
}

//------------------------------------------------------------- Missing
exports.missing = catchAsync(async (req, res, next) => {
    console.log("Start....");

    const classificationResult = await getClassificationResult(image);
    console.log(classificationResult.Calss);
    console.log("--------------------");

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
            let options = {
                type: "upload",
                prefix: classificationResult.Calss === "Cat" ? "Scooby/Missing/Founded/Cats" : "Scooby/Missing/Founded/Dogs",
            };

            const resources = await getAllResources(options);
            const foundedPets = resources.map((obj) => obj.secure_url);

            //console.log(foundedPets);
            //console.log("--------------------");

            const similarityPromises = foundedPets.map(async (foundedPet) => {
                const similarity = await getSimilarityDistance(image, foundedPet);

                const user = await FoundedModel.find({ petImage: foundedPet }).populate('userId');
                const userId = user[0].userId;
                const description = user[0].description;
                const location = user[0].locations;
                const phoneNumber = user[0].phoneNumber;
                const createdAt = user[0].createdAt;

                return {
                    similarity: 100 - similarity.rawMisMatchPercentage,
                    url: foundedPet,
                    description,
                    userId,
                    location,
                    phoneNumber,
                    createdAt
                };
            });

            const similarityArray = await Promise.all(similarityPromises);

            let sortedSimilarityArray = similarityArray.sort((a, b) => b.similarity - a.similarity);
            //console.log(sortedSimilarityArray);
            //console.log("--------------------");

            res.status(200).json({ 
                uploadedImage: image, 
                similarityArray: sortedSimilarityArray.slice(0, 2),
            });
            console.log("End......");
        } catch (err) {
            return next(new appError("Error in processing the request", 500));
        }
    }
});
