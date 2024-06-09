const express = require('express')
const router = express.Router();

const reminderController = require('../controllers/reminderController')
const authController = require("../controllers/authController")

router.use(authController.protect)
router.post('/addReminder',reminderController.addreminder)
router.get('/getMyRemindersInfo',reminderController.getMyRemindersInfo)
router.get('/getUpcomingReminders',reminderController.getUpcommingReminders)
router.get('/getAllReminders',reminderController.getAllReminders)
router.patch('/updateReminder/:id',reminderController.updateReminder)
router.delete('/deleteReminder/:id',reminderController.deleteReminder)

module.exports= router