const catchAsync = require("express-async-handler");
const petModel = require("../Models/petsModel");
const usermodel = require("../Models/userModel");
const appError = require("../utils/appError");
const multer = require("multer");
const cloudinary = require("../utils/cloud");
const sharp = require("sharp");
const userModel = require("../Models/userModel");

const axios = require('axios');


exports.filteradapt=catchAsync(async (req, res, next) => {
  const pets = await petModel.find({
    owner:'adoption'
  });
  //console.log(req.query)
  

  //console.log(pets)
  if (!pets) {
    return next(new appError(`cant find my pets`, 404));
  }
  res.status(200).json({
    status: "success",
    data: pets,
  });
});

//************************************************************* */
exports.filtertest=catchAsync(async (req, res, next) => {
  const pets = await petModel.find(req.query);
  //console.log(req.query)
  

  //console.log(pets)
  if (!pets) {
    return next(new appError(`cant find my pets`, 404));
  }
  res.status(200).json({
    status: "success",
    data: pets,
  });
});
//****************************************************************/
exports.filtercats=catchAsync(async (req, res, next) => {
  const pets = await petModel.find({
    type:'cat',
    availableForAdoption:true,
    //owner:'adoption'

  });
  //console.log(req.query)
  

  //console.log(pets)
  if (!pets) {
    return next(new appError(`cant find my pets`, 404));
  }
  res.status(200).json({
    status: "success",
    data: pets,
  });
});
//************************************************************ */
exports.filterdogs=catchAsync(async (req, res, next) => {
  const pets = await petModel.find({
    type:'dog',
    availableForAdoption:true
    //owner:'adoption'
  });
  //console.log(req.query)
  

  //console.log(pets)
  if (!pets) {
    return next(new appError(`cant find my pets`, 404));
  }
  res.status(200).json({
    status: "success",
    data: pets,
  });
});
//*************************************************************** */
exports.availableforadoption=catchAsync(async (req, res, next) => {
  const pets = await petModel.find({
    availableForAdoption:true,
    //owner:'adoption'
  });
  //console.log(req.query)
  

  //console.log(pets)
  if (!pets) {
    return next(new appError(`cant find my pets`, 404));
  }
  res.status(200).json({
    status: "success",
    data: pets,
  });
});





exports.setUserIds = (req, res, next) => {
  if (!req.body.user) {
    req.body.user = req.params.id; 
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

  const filePath = `Scooby/Pets`;
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

exports.getmypets = catchAsync(async (req, res, next) => {
  const pets = await petModel.find({ user: req.params.id });

  //console.log(pets)
  if (!pets) {
    return next(new appError(`cant find my pets`, 404));
  }
  res.status(200).json({
    status: "success",
    data: pets,
  });
});

exports.addpettouser = catchAsync(async (req, res, next) => {
  const newpet = await petModel.create(req.body);
  const user = await usermodel.findById(req.params.id);
  console.log(user)
  user.pets.push(newpet.id);
  
  await user.save();
  res.status(201).json({
    status: "success",
    data: newpet,
  });
});
//********************************************************************* */
exports.addpet = catchAsync(async (req, res, next) => {
  const newpet = await petModel.create(req.body);
  res.status(201).json({
    status: "success",
    data: newpet,
  });
});
//*************************************************************** */
exports.getpets = catchAsync(async (req, res, next) => {
 
  const pets = await petModel.find()
  
  //.populate({
  //         path:'user',
  //         select:'Name'

  // })
  res.status(200).json({
    status: "success",
    data: pets,
  });
});
//*************************************************************** */

// Function to get classification result
async function getClassificationResult(imageUrl) {
    try {
        const response = await axios.get(`https://scoopy-ai-api.onrender.com/clssification?image=${encodeURIComponent(imageUrl)}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching classification result:', error);
        throw error;
    }
}

// Function to get similarity distance between two images
async function getSimilarityDistance(file1Url, file2Url) {
    try {
        const response = await axios.get(`https://scoopy-ai-api.onrender.com/distance?file1=${encodeURIComponent(file1Url)}&file2=${encodeURIComponent(file2Url)}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching similarity distance:', error);
        throw error;
    }
}

exports.missing=catchAsync(async (req, res,next) => {
  try {
      const imageUrl = req.query.image;
     const file1Url = req.query.file1;
      const file2Url = req.query.file2;

      const classificationResult = await getClassificationResult(imageUrl);
      const similarityDistance = await getSimilarityDistance(imageUrl, file2Url);

     // res.json({ classificationResult, similarityDistance });
     console.log(classificationResult)
     console.log(similarityDistance)
      if(classificationResult){
      res.status(200).json({
          status:'success',
            data:{classificationResult,similarityDistance}
        })

      //   if(similarityDistance)(
      //     res.status(200).json({
      //         status:'success',
      //           data:similarityDistance
      //       })


        //)
       // console.log(classificationResult)
       // console.log(similarityDistance)

     next()
  }
}catch (error) {
      console.error('An error occurred:', error);
      res.status(500).json({ error: 'An error occurred' });
  }
})



