const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = require('./app')

dotenv.config({path: './config.env'})

const port = process.env.PORT || 3000
app.listen(port, ()=>{
    console.log('Server started on port 8000')
})