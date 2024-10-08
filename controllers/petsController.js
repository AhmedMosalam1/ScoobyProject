const catchAsync = require("express-async-handler");
const petModel = require("../Models/petsModel");
const usermodel = require("../Models/userModel");
const shelterModel=require('../Models/shelterModel')
const appError = require("../utils/appError");
const multer = require("multer");
const cloudinary = require("../utils/cloud");
const sharp = require("sharp");
//const userModel = require("../Models/userModel");


exports.setUserIds = (req, res, next) => {
  if (!req.body.user) {
    req.body.user = req.user.id; 
    console.log(req.user.id)
    //req.user.id = req.params.id
    // console.log(req.body.user)
  }
 
  next();
};



exports.setshelterIds = (req, res, next) => {
  
  if(!req.body.shelterInfo){
    req.body.shelterInfo=req.params.id
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


exports.filteradaptcat=catchAsync(async (req, res, next) => {
  const pets = await petModel.find({
    owner:'adoption',
    type:'cat'
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

exports.filteradaptdog=catchAsync(async (req, res, next) => {
  const pets = await petModel.find({
    owner:'adoption',
    type:'dog'
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


//*************************************************** */
exports.getmypets = catchAsync(async (req, res, next) => {
  const pets = await petModel.find({ user: req.user.id });

  //console.log(pets)
  if (!pets) {
    return next(new appError(`cant find my pets`, 404));
  }
  res.status(200).json({
    status: "success",
    data: pets,
  });
});

//*********************************************** */

exports.addpettouser = catchAsync(async (req, res, next) => {
  // req.body.user = req.user.id
  // console.log(req.user.id)
  const newpet = await petModel.create(req.body);
  const user = await usermodel.findById(req.user.id);
  //console.log(user)
  user.pets.push(newpet.id);
  
  await user.save();
  res.status(201).json({
    status: "success",
    data: newpet,
  });
});


//******************************************* */
exports.addpettoshelter=catchAsync(async (req, res, next) => {
  const newpet = await petModel.create(req.body);
  const shelter = await shelterModel.findById(req.params.id);
 // console.log(user)
  shelter.pets_Id.push(newpet.id);
  
  await shelter.save();
 
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
 
  const pets = await petModel.find().populate('user')
  
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
exports.updatepet = catchAsync(async (req, res, next) => {
    
  const pet = await petModel.findByIdAndUpdate(req.params.id, req.body, { new: true })

  if (!pet) {
      return next(new appError(`Can't find this pet`, 404));
  }


  res.status(201).json({
      status: "success",
      data: {
          data: pet
      }
  })
})

//************************************************************* */
exports.deletepet = catchAsync(async(req,res,next)=>{
  // //const petId = req.params.id
  // const pet = await petModel.findByIdAndDelete(req.params.id)
  // if(!pet){
  //     return next(new appError('pet not found',400))
  // }
  
  // res.status(200).json({
  //     message:'pet deleted successfully'
  // })
  const petId = req.params.id;

  // Find and delete the pet
  const pet = await petModel.findByIdAndDelete(petId);
  if (!pet) {
    return next(new appError('Pet not found', 400));
  }

  // Find the user and remove the pet ID from the user's pets array
  const user = await usermodel.findById(pet.user); // Assuming pet.user stores the user ID
  if (!user) {
    return next(new appError('User not found', 400));
  }

  user.pets = user.pets.filter(id => id.toString() !== petId.toString());
  await user.save();

  res.status(200).json({
    message: 'Pet deleted successfully',
  });
})

//***************************************** */
exports.filterdogsforkids=catchAsync(async (req, res, next) => {
  const pets = await petModel.find({
    type:'dog',
    petsforkids:true
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
//********************************************** */
exports.filtercatsforkids=catchAsync(async (req, res, next) => {
  const pets = await petModel.find({
    type:'cat',
    petsforkids:true,
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


exports.successAdapted=catchAsync(async (req, res, next) => {
  const pets = await petModel.find({
    successflyAdaped:true,
  
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

//******************************************** */
exports.getallpetsquery = catchAsync(async (req, res, next) => {
  // Check if type query parameter is provided
  if (req.query.type) {
    const typee = req.query.type;

    // Validate the type value and query the database accordingly
    if (typee === 'cat' || typee === 'dog') {
      const pets = await petModel.find({ type: typee });
      res.status(200).json({
        status: "success",
        data: pets,
      });
    } else if (typee === 'all') {
      const pets = await petModel.find();
      res.status(200).json({
        status: "success",
        data: pets,
      });
    } else {
      // Invalid type value
      res.status(400).json({
        status: "fail",
        message: "Invalid type value. Please choose 'cat', 'dog', or 'all'.",
      });
    }
  } else {
    // If no type query parameter is provided, return all pets by default
    const pets = await petModel.find();
    res.status(200).json({
      status: "success",
      data: pets,
    });
  }
});


