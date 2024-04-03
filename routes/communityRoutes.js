const express = require('express')
const router = express.Router();

const communityController = require('../controllers/communityController')
const authController = require("../controllers/authController")

router.use(authController.protect)

router.post('/addPost',communityController.uploadPhoto1, communityController.resizePhotoProject, communityController.addPost)
router.patch('/likeAndDisLike/:id',communityController.likeAndDisLike)
router.get('/getAllPosts',communityController.getAllPosts)
router.get('/myMoments/:id',communityController.getMyMoments)
//router.post('/addpet/:id',petContrller.setUserIds,petContrller.addpet)
//router.patch('/editPost/:id',communityController.setUserIds,communityController.editPost)
router.patch('/editPost/:id',communityController.uploadPhoto1, communityController.resizePhotoProject,communityController.editPost)
router.delete('/deletePost/:id',communityController.deletePost)

module.exports= router