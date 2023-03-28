const express = require('express');
const jobRouter = require('./routes/jobRoutes')

const app = express();

app.use('/api/v1/jobs', jobRouter)

app.listen(8000, ()=>{
    console.log('Server started on port 8000')
})