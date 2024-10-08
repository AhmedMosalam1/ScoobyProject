const catchAsync = require('express-async-handler');
const communityModel = require('../Models/communityModel')
const userModel = require("../Models/userModel")
const appError = require("../utils/appError")
const jwt = require('jsonwebtoken')
const multer = require("multer")
const cloudinary = require("../utils/cloud")
const sharp = require("sharp")
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

function shufflePosts(array) {
    // Loop over the array from the end to the beginning
    for (let i = array.length - 1; i > 0; i--) {
        // Generate a random index between 0 and i
        const j = Math.floor(Math.random() * (i + 1));
        // Swap the elements at positions i and j
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

//-------------------------------------------------------------add post
exports.addPost = catchAsync(async(req,res,next)=>{
    const userId = req.user.id
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
    const allPosts = await communityModel.find({onlyMe:false})
    const userId = req.user._id;
    let shuffledPosts = await shufflePosts(allPosts)

    const processedPosts = await Promise.all(shuffledPosts.map(async (post) => {
        const userLikedThisPost = post.likes_Id.includes(userId);
        return {post, liked: userLikedThisPost };
    }));
    res.status(200).json({
        processedPosts
    })
})
//-------------------------------------------------------------get user posts
exports.getUserMoments = catchAsync(async(req,res)=>{
    const userId = req.params.id ;
    const myId = req.user.id
    const userMoments = await communityModel.find({userId:userId})
    const processedPosts = await Promise.all(userMoments.map(async (post) => {
        const userLikedThisPost = post.likes_Id.includes(myId);
        return {post, liked: userLikedThisPost };
    }));
    res.status(200).json({
        processedPosts
    })
    
})
//-------------------------------------------------------------delete post
exports.deletePost = catchAsync(async(req,res)=>{
    const post = req.user.id
    if(!post){
        return next(new appError('post not found',400))
    }
    await communityModel.findByIdAndDelete(req.params.id)
    res.status(200).json({
        message:'post deleted successfully'
    })
})
//-------------------------------------------------------------edit post
exports.editPost = catchAsync(async(req,res)=>{
    const postId = req.user.id
    const newDescription = req.body.description
    //console.log(req.body.description)
    const post = await communityModel.findByIdAndUpdate(postId,{
        description:newDescription
    })
    post.save()
    res.status(200).json({
        post
    })
})
//-------------------------------------------------------------Like & disLike
exports.likeAndDisLike = catchAsync(async(req,res,next)=>{
    const currentUser = await userModel.findById(req.user.id)
    let post = await communityModel.findById(req.query.postId)
    let liked
    if(!currentUser){
        return next(new appError('You should login first'),401)
    }
    const isLiked = post.likes_Id.includes(currentUser._id)
    if(isLiked){
        //disLike
        post = await communityModel.findByIdAndUpdate(post._id, { $pull: { likes_Id: currentUser._id }, $inc: { likesNumber: -1 } }, { new: true })
        liked = false
        res.status(200).json({post,liked})
    }else{
        //like
        post = await communityModel.findByIdAndUpdate(post._id, { $push: { likes_Id: currentUser._id }, $inc: { likesNumber: 1 } }, { new: true })
        liked = true
        res.status(200).json({post,liked})
    }
})
//-------------------------------------------------------------get my moments
exports.getMyMoments = catchAsync(async(req,res)=>{
    const userId = req.user.id ;
    const MyMoments = await communityModel.find({userId:userId})
    const processedPosts = await Promise.all(MyMoments.map(async (post) => {
        const userLikedThisPost = post.likes_Id.includes(userId);
        return {post, liked: userLikedThisPost };
    }));
    res.status(200).json({
        processedPosts
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
