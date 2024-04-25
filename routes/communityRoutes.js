const express = require('express')
const router = express.Router();

const communityController = require('../controllers/communityController')
const authController = require("../controllers/authController")

router.use(authController.protect)

router.post('/addPost/:id',communityController.uploadPhoto1, communityController.resizePhotoProject, communityController.addPost)
router.patch('/likeAndDisLike/:id',communityController.likeAndDisLike)
router.get('/getAllPosts',communityController.getAllPosts)
router.get('/myMoments/:id',communityController.getMyMoments)
router.patch('/editPost/:id',communityController.editPost)
router.delete('/deletePost/:id',communityController.deletePost)

module.exports= router