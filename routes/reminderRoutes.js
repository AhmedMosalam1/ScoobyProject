const express = require('express')
const router = express.Router();

const reminderController = require('../controllers/reminderController')

router.post('/addReminder/:id',reminderController.addreminder)
router.get('/getMyRemindersInfo/:id',reminderController.getMyRemindersInfo)
router.get('/getUpcomingReminders/:id',reminderController.getUpcommingReminders)
router.patch('/updateReminder/:id',reminderController.updateReminder)
router.delete('/deleteReminder/:id',reminderController.deleteReminder)

module.exports= router