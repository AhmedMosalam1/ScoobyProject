const express = require('express')
const router = express.Router();

const userController = require('../controllers/userControllers')
const authController = require("../controllers/authController")


router.get('/getalluser',userController.getAll)
router.delete('/deleteuser',userController.deleteAll)

router.patch("/updateuser/:id",userController.setUserIds,userController.uploadPhoto,userController.resizePhotoProject,userController.updateOne)
router.patch("/followunfollowuser/:id",userController.followUnFollowUser)
router.delete('/deleteuser/:id',userController.deleteOne)

router.use(authController.protect)
router.get("/getuser",userController.getOne)

module.exports = router
