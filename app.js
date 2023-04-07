const express = require('express');
const jobRouter = require('./routes/jobRoutes')

const app = express();

app.use('/api/v1/jobs', jobRouter)

module.exports = app