const catchAsync = require("express-async-handler");
const usermodel = require("../Models/userModel");
const foundedPet=require('../Models/foundedModel')
const appError = require("../utils/appError");
const multer = require("multer");
const cloudinary = require("../utils/cloud");
const sharp = require("sharp");
const axios = require("axios");

function shufflePets(array) {
  // Loop over the array from the end to the beginning
  for (let i = array.length - 1; i > 0; i--) {
      // Generate a random index between 0 and i
      const j = Math.floor(Math.random() * (i + 1));
      // Swap the elements at positions i and j
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

let image
//---------------------------------------------------------------------------- classification
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
//---------------------------------------------------------------------------- upload image to draft 
exports.setUserIds = (req, res, next) => {
  if (!req.body.userId) {
    req.body.userId = req.user.id; 
    //req.user.id = req.params.id
    // console.log(req.body.user)
  }
  next();
};

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

exports.resizePhotoProjectDraft = catchAsync(async (req, res, next) => {
  //console.log(req.file);

  if (!req.file) return next();
  console.log("object");

  req.body.petImage = `${req.file.originalname}`;

  const imageBuffer = await sharp(req.file.buffer)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toBuffer();

  const filePath = `Scooby/Draft`;
  const fileName = req.body.petImage;

  const result = await uploadToClodinary(imageBuffer, fileName, filePath);
  //console.log(result)

  req.body.petImage= result.secure_url;
  image = req.body.petImage

  console.log('---------------------')
  console.log('image after upload to draft...')
  console.log(image)
  console.log('---------------------')

  next();
});
//---------------------------------------------------------------------------- upload image to cats or dogs folder

exports.resizePhotoProjectCatOrDog = catchAsync(async (req, res, next) => {
  // console.log(req.file);

  if (!req.file) return next();

  req.body.petImage = `${req.file.originalname}`;

  const imageBuffer = await sharp(req.file.buffer)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toBuffer();
  
  // Log the classification result
  console.log("classification result...")
  const classificationResult = await getClassificationResult(image);
  console.log(classificationResult.Calss);
  console.log('---------------------');

  // Proceed based on the classification result
  if (classificationResult.Calss === "Cat") {
    req.body.type = 'cat'
    const filePathCat = `Scooby/Missing/Founded/Cats`;
    const fileName = req.body.petImage;
    const resultCat = await uploadToClodinary(imageBuffer, fileName, filePathCat);
    req.body.petImage = resultCat.secure_url;
  } else if (classificationResult.Calss === "Dog") {
    req.body.type = 'dog'
    const filePathDog = `Scooby/Missing/Founded/Dogs`;
    const fileName = req.body.petImage;
    const resultDog = await uploadToClodinary(imageBuffer, fileName, filePathDog);
    req.body.petImage = resultDog.secure_url;
  }else{
    return next(new appError('Please enter another image.'))
  }
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

//---------------------------------------------------------------------------- add new pet
exports.foundedPets= catchAsync(async (req, res, next) => {
  //if(req.body.locations.coordinates){
    //req.body.locations.coordinates = req.body.locations.coordinates.split(',').map(coord => parseFloat(coord.trim()));
 // }
    const newpet = await foundedPet.create(req.body);
    res.status(201).json({
      status: "success",
      data: newpet,
    });
  });
//---------------------------------------------------------------------------- get all pets
exports.getallFounded=catchAsync(async (req, res, next) => {
    const allPets = await foundedPet.find().populate('userId')
    res.status(201).json({
      status: "success",
      data: allPets,
    });
  });
//---------------------------------------------------------------------------- get cats
exports.getcats=catchAsync(async (req, res, next) => {
  const cats = await foundedPet.find({type:'cat'}).populate('userId')
  const shuffledCats =await shufflePets(cats)
  res.status(201).json({
    length:shuffledCats.length,
    shuffledCats
  });
});
//---------------------------------------------------------------------------- get dogs
exports.getdogs=catchAsync(async (req, res, next) => {
  const dogs = await foundedPet.find({type:'dog'}).populate('userId')
  const shuffledDogs =await shufflePets(dogs)
  res.status(201).json({
    length:dogs.length,
    dogs
  });
});
//---------------------------------------------------------------------------- get Recently Added Pets 
  exports.getRecentlyAddedPets = catchAsync(async (req, res, next) => {

    const currentDate = new Date();
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(currentDate.getDate() - 21);

    const recentlyAddedPets = await foundedPet.find({
        createdAt: { $gte: threeDaysAgo}
    }).populate('userId')

    const shuffledPets = await shufflePets(recentlyAddedPets)

    res.status(200).json({
      length:recentlyAddedPets.length,
      recentlyAddedPets
    });
});








