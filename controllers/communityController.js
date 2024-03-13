const catchAsync = require('express-async-handler');
const communityModel = require('../Models/communityModel')
const userModel = require("../Models/userModel")
const appError = require("../utils/appError")
const jwt = require('jsonwebtoken')
const multer = require("multer")
const cloudinary = require("../utils/cloud")
const sharp = require("sharp")
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

//-------------------------------------------------------------add post
exports.addPost = catchAsync(async(req,res)=>{
    const userId = req.params.id
    const user = await userModel.findById(userId)
    const userImage = user.profileImage
    const userName = user.name
    const post = await communityModel.create({
        userId:userId,
        userImage:userImage,
        userName:userName,
        postImage:req.body.postImage,
        description:req.body.description,
        onlyMe:req.body.onlyMe
    })
    res.status(200).json({
        post
    })
    
})
//-------------------------------------------------------------get all posts
exports.getAllPosts = catchAsync(async(req,res)=>{
    const allPosts = await communityModel.find({onlyMe:false})
    res.status(200).json({
        allPosts
    })
    
})
//-------------------------------------------------------------add like
exports.addLike = catchAsync(async(req,res)=>{
    const postId = req.params.id
    const post = await communityModel.findById(postId)
    post.likes +=1 ;
    post.save()
    res.status(200).json({
        likes:post.likes
    })
    
})
//-------------------------------------------------------------dis like
exports.disLike = catchAsync(async(req,res)=>{
    const postId = req.params.id
    const post = await communityModel.findById(postId)
    post.likes -=1 ;
    post.save()
    res.status(200).json({
        likes:post.likes
    })
})
//-------------------------------------------------------------get my moments
exports.getMyMoments = catchAsync(async(req,res)=>{
    const userId = req.params.id ;
    const MyMoments = await communityModel.find({userId:userId})
    res.status(200).json({
        MyMoments
    })
    
})
//-------------------------------------------------------------upload images
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

    // await sharp(req.files.projectImage[0].buffer)
    //     .toFormat('jpeg')
    //     .jpeg({ quality: 90 })
    //     .toFile(`upload/project/${req.body.imageCover}`)

    // const result1 = await cloudinary.uploader.upload(`upload/project/${req.body.imageCover}`, {
    //     public_id: `${Date.now()}_Cover`,
    //     crop: 'fill',
    // });

exports.uploadPhoto1 = upload.single('postImage') //      <-------

exports.resizePhotoProject = catchAsync(async (req, res, next) => {

    //----------------------------------------------------------------------------------------service image
    //console.log(req.file);
    if (!req.file) return next()

    const fileName1 = `${req.file.originalname}` 

    // const imageBuffer = await sharp(req.file.buffer)
    //     .toFormat('jpeg')
    //     .jpeg({ quality: 90 })
    //     .toBuffer()

    const filePath1 = `Scooby/community` //    <-------

    const result1 = await uploadToClodinary(req.file.buffer, fileName1, filePath1) //
    req.body.postImage = result1.secure_url //    <-------

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
