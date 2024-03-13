const express = require('express')
const router = express.Router();

const communityController = require('../controllers/communityController')

router.post('/addPost/:id',communityController.uploadPhoto1, communityController.resizePhotoProject, communityController.addPost)
router.patch('/addLike/:id',communityController.addLike)
router.patch('/disLike/:id',communityController.disLike)
router.get('/getAllPosts',communityController.getAllPosts)
router.get('/myMoments/:id',communityController.getMyMoments)

module.exports= router