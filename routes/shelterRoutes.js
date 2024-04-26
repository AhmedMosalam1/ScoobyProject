const express = require('express')
const router = express.Router();

const shelterController = require('../controllers/shelterController')

router.post('/addShelter',shelterController.shelterIamges,shelterController.addShelter)
router.get('/allShelters',shelterController.getAllShelters)
router.get('/petsInShelters',shelterController.petsInShelters)
router.get('/petsInShelter/:id',shelterController.getPetsInShelter)
router.delete('/deleteShelter/:id',shelterController.deleteshelter)
router.get('/getShelter/:id',shelterController.getShelter)
router.patch('/updateShelter/:id',shelterController.shelterIamges,shelterController.updateshelter)


module.exports= router