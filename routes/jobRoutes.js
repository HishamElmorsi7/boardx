const express = require('express');

const router = express.Router();

router
    .route('/')
    .get(/* Get all jobs controller*/)
    .post( /* create a new job */)

router
    .route('/:id')
    .get(/* get a job with a specific id */)
    .patch(/* alter a job */)
    .delete(/* delete a job */)

module.exports = router