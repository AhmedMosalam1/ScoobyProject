const express = require('express')
const router = express.Router();

const shelterController = require('../controllers/shelterController')

router.post('/addShelter',shelterController.uploadPhoto1, shelterController.resizePhotoProject, shelterController.addShelter)
router.get('/allShelters',shelterController.getAllShelters)
router.get('/petsInShelters',shelterController.petsInShelters)
router.get('/deleteShelter/:id',shelterController.deleteshelter)

module.exports= router