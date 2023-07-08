const express = require('express');
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')

const router = express.Router();
router.route('/signup').post(authController.signup)

// router.route('/').get(userController.getAllUsers).post(userController.createUser)
// router.route('/:id').get(userController.getJob).patch(userController.updatejob).delete(userController.deleteJob)

module.exports = router;