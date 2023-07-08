const express = require('express');
const jobRouter = require('./routes/jobRoutes')
const userRouter = require('./routes/userRoutes')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')

const app = express();

// MIDDLEWARES
app.use(express.json())

// ROUTES
app.use('/api/v1/jobs', jobRouter)
app.use('/api/v1/users', userRouter)

// NON EXISTING ROUTES
// all here matches all http methods

// If the next function receives an argument, no matter what it is,
// Express will automatically know that there was an error
// so it will assume that whatever we pass into next
// is gonna be an error. so the other middlewares on the stacks won't be executed
// and the global error handling middleware will be executed
app.all('*', (req, res, next)=> {
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Can't find ${req.originalUrl} on the server`
    // })

    // What we pass to Error constructor is the message that we can call with error.message()
    // const error = new Error(`Can't find ${req.originalUrl} on the server`)
    // error.statusCode = 404
    // error.status = 'fail'



    
    next(new AppError(`Can't find ${req.originalUrl} on the server`, 404))
})
// Remember that the middleware is called and passed the args by express
app.use(globalErrorHandler)
module.exports = app