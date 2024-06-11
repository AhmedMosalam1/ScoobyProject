const express=require('express');
const reviewController=require('../controllers/reviewController')
const AuthController=require('../controllers/authController')

//const router=express.Router()
//merge parameters
const router=express.Router({mergeParams:true})

//router.use(AuthController.protect)


router.get('/getAllReview/:id',reviewController.getAllReview)

 router.post('/createReviewService/:id',AuthController.protect,reviewController.setServiceUserIds,reviewController.createReviewSerivce)
 router.post('/createReviewDoctor/:id',AuthController.protect,reviewController.setDoctorsUserIds,reviewController.createReviewDoctor)
 router.post('/createReviewShelter/:id',AuthController.protect,reviewController.setShelterUserIds,reviewController.createReviewShelter)



// router.post('/createReviewService/:id',reviewController.createReview)
// router.post('/createReviewDoctor/:id',reviewController.createReview)
// router.post('/createReviewShelter/:id',reviewController.createReview)


router.delete('/deleteReview/:id',reviewController.deleteReview)
router.patch('/updateReview/:id',reviewController.updateReview)
router.get('/getMyReviews/:id',reviewController.getMyReviews)
//router.get('/getAllAppReviews',reviewController.getAllAppReviews)


module.exports=router
