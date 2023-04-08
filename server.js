const dotenv = require('dotenv')
const app = require('./app')

dotenv.config({path: './config.env'})
app.listen(8000, ()=>{
    console.log('Server started on port 8000')
})