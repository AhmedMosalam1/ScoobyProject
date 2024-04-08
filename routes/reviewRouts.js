const express=require('express');
const reviewController=require('../controllers/reviewController')
const AuthController=require('../controllers/authController')

//const router=express.Router()
//merge parameters
const router=express.Router({mergeParams:true})

router.use(AuthController.protect)


router.get('/getAllReview/:id',reviewController.getAllReview)
router.post('/createReview/:id',reviewController.setServiceUserIds,reviewController.createReview)
router.delete('/deleteReview/:id',reviewController.setServiceUserIds,reviewController.deleteReview)
router.patch('/updateReview/:id',reviewController.updateReview)


module.exports=router
