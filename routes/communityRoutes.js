const express = require('express')
const router = express.Router();

const communityController = require('../controllers/communityController')
const authController = require("../controllers/authController")

router.use(authController.protect)

router.post('/addPost',communityController.uploadPhoto1, communityController.resizePhotoProject, communityController.addPost)
router.patch('/likeAndDisLike',communityController.likeAndDisLike)
router.get('/getAllPosts',communityController.getAllPosts)
router.get('/myMoments',communityController.getMyMoments)
router.get('/userMoments/:id',communityController.getUserMoments)
router.patch('/editPost',communityController.editPost)
router.delete('/deletePost',communityController.deletePost)

module.exports= router