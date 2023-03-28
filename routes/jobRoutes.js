const express = require('express');
const jobController = require('../controllers/jobController')

const router = express.Router();

router
    .route('/')
    .get(jobController.getAllJobs)
    .post(jobController.createJob)

router
    .route('/:id')
    .get(/* get a job with a specific id */)
    .patch(/* alter a job */)
    .delete(/* delete a job */)

module.exports = router