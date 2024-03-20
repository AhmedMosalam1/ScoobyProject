const User = require("../Models/userModel")
const catchAsync = require('express-async-handler');
const appError = require("../utils/appError")
const multer = require("multer")
const cloudinary = require("../utils/cloud")
const sharp = require("sharp")


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

exports.uploadPhoto = upload.single('profileImage')

exports.resizePhotoProject = catchAsync(async (req, res, next) => {

    if (!req.file) return next()

    const fileName = `${req.file.originalname}`
    const filePath = `Scooby/Users`

    const result = await uploadToClodinary(req.file.buffer, fileName, filePath)
    req.body.profileImage = result.secure_url

    next()
})


const uploadToClodinary = (buffer, filename, folderPath, options = {}) => {
    return new Promise((resolve, reject) => {
        options.folder = folderPath;
        options.public_id = filename;

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

exports.setUserIds = (req, res, next) => {
  if (!req.params.id) {
    req.params.id = req.user.id;
    // console.log(req.body.user)
  }
  next();
};

exports.deleteOne = catchAsync(async (req, res, next) => {
    const id = req.params.id

    const doc = await User.findById(id)

    if (!doc) {
        return next(new appError(`Can't find User on this id`, 404));
    }

    await doc.remove()

    res.status(201).json({
        status: "deleted success",
    })
})

exports.deleteAll = catchAsync(async (req, res, next) => {

    await User.deleteMany()

    res.status(201).json({
        status: "Delete All Successfully",
    })
})

exports.getOne = catchAsync(async (req, res, next) => {
    
    let doc = await User.findById(req.params.id).populate('pets').populate('services_id')

    if (!doc) {
        return next(new appError(`Can't find User on this id`, 404));
    }

    res.status(201).json({
        status: "success",
        data: {
            data: doc
        }
    })
})

exports.updateOne = catchAsync(async (req, res, next) => {
    if (req.body.password) {
        const result = await User.findById(req.params.id).select('+password')

        if (!(await result.correctPassword(req.body.passwordCurrent, result.password))) {
            return next(new appError("Your current password is incorrect", 401))
        }
        result.password = req.body.password
        await result.save()
    }


    const doc = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }) //new is true => to return new doc after update

    if (!doc) {
        return next(new appError(`Can't find User on this id`, 404));
    }

   // doc.save()

    res.status(201).json({
        status: "success",
        data: {
            data: doc
        }
    })
})


exports.getAll = catchAsync(async (req, res) => {

    const documents = await User.find();

    res
        .status(200)
        .json({ results: documents.length, data: documents });
});

exports.followUnFollowUser = catchAsync(async (req, res,next) => {
   
      const { id } = req.params;
      const userToModify = await User.findById(id);
      const currentUser = await User.findById(req.user._id);
  
      if (id === req.user._id.toString())
      return next(new appError(`You cannot follow/unfollow yourself`, 400));
  
      if (!userToModify || !currentUser)
      return next(new appError(`User Not Found`, 400));
  
      const isFollowing = currentUser.following.includes(id);
  
      if (isFollowing) {
        // Unfollow user
        await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } , });
        await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
        res.status(200).json({ message: "User unfollowed successfully" });
      } else {
        // Follow user
        await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
        await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
        res.status(200).json({ message: "User followed successfully" });
      }
});
