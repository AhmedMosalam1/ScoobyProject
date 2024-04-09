const catchAsync = require("express-async-handler");
const usermodel = require("../Models/userModel");
const foundedPet=require('../Models/foundedModel')
const appError = require("../utils/appError");
const multer = require("multer");
const cloudinary = require("../utils/cloud");
const sharp = require("sharp");



exports.setUserIds = (req, res, next) => {
  if (!req.body.userId) {
    req.body.userId = req.params.id; 
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

exports.resizePhotoProject = catchAsync(async (req, res, next) => {
  //console.log(req.file);

  if (!req.file) return next();
  console.log("object");

  req.body.petImage = `${req.file.originalname}`;

  const imageBuffer = await sharp(req.file.buffer)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toBuffer();

  const filePath = `Scooby/Missing/Founded`;
  const fileName = req.body.petImage;

  const result = await uploadToClodinary(imageBuffer, fileName, filePath);
  //console.log(result)

  req.body.petImage = result.secure_url;

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



exports.foundedPets= catchAsync(async (req, res, next) => {
    const newpet = await foundedPet.create(req.body);

    res.status(201).json({
      status: "success",
      data: newpet,
    });
  });

exports.getallFounded=catchAsync(async (req, res, next) => {
    const allPets = await foundedPet.find().populate('userId')

    res.status(201).json({
      status: "success",
      data: allPets,
    });
  });








