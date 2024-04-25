const express = require('express')
const router = express.Router();

const vaccineController = require('../controllers/vaccineController')

router.post('/addVaccine/:id',vaccineController.addvaccine)
router.get('/getAllPetVaccines/:id',vaccineController.getAllPetVaccines)
router.get('/getDoctorByName',vaccineController.getDoctorByName)
router.get('/getVaccineByName',vaccineController.getVaccineByName)
router.patch('/updateVaccine/:id',vaccineController.updateVaccine)
router.delete('/deleteVaccine/:id',vaccineController.deleteVaccine)

module.exports= router