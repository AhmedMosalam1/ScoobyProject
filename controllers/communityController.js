const catchAsync = require('express-async-handler');
const communityModel = require('../Models/communityModel')
const userModel = require("../Models/userModel")
const appError = require("../utils/appError")
const jwt = require('jsonwebtoken')
const multer = require("multer")
const cloudinary = require("../utils/cloud")
const sharp = require("sharp")
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;


exports.setUserIds = (req, res, next) => {
    
      //req.body.user = req.params.id; 
      //req.body = req.params.id
      // console.log(req.body.user)
    
    next();
  };

//-------------------------------------------------------------add post
exports.addPost = catchAsync(async(req,res,next)=>{
    const userId = req.user._id
    const user = await userModel.findById(userId)
    const userImage = user.profileImage
    const userName = user.name
    if(!user){
        return next(new appError('You should login first'),401)
    }
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
    const allPosts = await communityModel.find({onlyMe:false}).populate('likes_Id')
    res.status(200).json({
        allPosts
    })
    
})
//-------------------------------------------------------------delete post
exports.deletePost = catchAsync(async(req,res)=>{
    const post = req.params.id
    if(!post){
        return next(new appError('post not found',400))
    }
    await communityModel.findByIdAndDelete(req.params.id)
    res.status(200).json({
        message:'post deleted successfully'
    })
})
//-------------------------------------------------------------edit post
exports.editPost = catchAsync(async(req,res,next)=>{
    const postId = req.params.id
    const newDescription = req.body.description
    console.log(req.body)
    const post = await communityModel.findByIdAndUpdate(postId,{
        description:newDescription
    },{new:true})
    post.save()
    res.status(200).json({
        post
    })
    next()}
)
//-------------------------------------------------------------Like & disLike
exports.likeAndDisLike = catchAsync(async(req,res,next)=>{
    const currentUser = await userModel.findById(req.user._id)
    const post = await communityModel.findById(req.params.id)
    if(!currentUser){
        return next(new appError('You should login first'),401)
    }
    const isLiked = post.likes_Id.includes(currentUser._id)
    if(isLiked){
        //disLike
        await communityModel.findByIdAndUpdate(post._id, {$pull: { likes_Id:currentUser._id }})
        await communityModel.findByIdAndUpdate(post._id, {$inc: { likesNumber:-1 }})
        post.save()
        res.status(200).json({post})
    }else{
        //like
        await communityModel.findByIdAndUpdate(post._id, {$push: { likes_Id:currentUser._id }})
        await communityModel.findByIdAndUpdate(post._id, {$inc: { likesNumber:1 }})
        post.save()
        res.status(200).json({post})
    }
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
