const express = require('express');
const jobRouter = require('./routes/jobRoutes')

const app = express();

// MIDDLEWARES
app.use(express.json())

// ROUTES
app.use('/api/v1/jobs', jobRouter)

module.exports = app