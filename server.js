const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = require('./app')

dotenv.config({path: './config.env'})

DB = process.env.DATABASE_LOCAL

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {console.log('Connected successfully with DB')})

const port = process.env.PORT || 3000
app.listen(port, ()=>{
    console.log('Server started on port 8000')
})