const express = require('express')
const router = express.Router();

const userController = require('../controllers/userControllers')
const authController = require("../controllers/authController")

//router.use(authController.protect)

router.get('/getalluser',userController.getAll)
router.delete('/deleteuser',userController.deleteAll)

router.get("/getuser/:id",userController.setUserIds,userController.getOne)
router.patch("/updateuser/:id",userController.uploadPhoto,userController.resizePhotoProject,userController.updateOne)
router.patch("/followunfollowuser/:id",userController.followUnFollowUser)
router.delete('/deleteuser/:id',userController.deleteOne)


module.exports = router
