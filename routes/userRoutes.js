const express = require('express')
const router = express.Router();

const userController = require('../controllers/userControllers')
const authController = require("../controllers/authController")


router.get('/getalluser',userController.getAll)
router.get('/getOneUser/:id',userController.getOneUser)

router.use(authController.protect)
router.get("/getuser",userController.getOne)
router.patch("/updateuser",userController.uploadPhoto,userController.resizePhotoProject,userController.updateOne)
router.patch("/followunfollowuser/:id",userController.followUnFollowUser)
router.delete('/deleteuser',userController.deleteAll)
router.delete('/deleteuser/:id',userController.deleteOne)

module.exports = router
