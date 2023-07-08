const AppError = require('../utils/appError')

// cast Error will be as the name says for sections that doesn't
// have the specified type (couldn't cast to specified type)

const handleCastError = (error) => {
    return new AppError(`Invalid ${error.path}: ${error.value}`, 400)
}

const handleDuplicateFieldsError = (error) => {
    const value = error.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value! ;)`
    return new AppError(message, 400)
}

const handleValidationError = (error) => {
    const errors = Object.values(error.errors).map( el => el.message)
    const message = `Invalid Input Data. ${errors.join('. ')}`
    return new AppError(message, 400)

}


const sendDevError = (error, res) => {
    error.statusCode = error.code.statusCode || 500
    error.status = error.status || 'error'

    res.status(error.statusCode).json({
        status: error.status,
        error: error,
        stack: error.stack,
        message: error.message
    })
}


const sendProductionError = (error, res) => {
    console.log(`${error.statusCode}`)
    
    error.statusCode = error.statusCode || 500
    error.status = error.status || 'error'

    if(error.isOperational) {
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message
        })
    } else {
        console.error('ERROR =>', error)

        res.status(500).json({
            status: 'error',
            message: 'something went wrong'
        })
    }


}

module.exports = (error, req, res, next) => {
    console.log('hello')
    // console.log(process.env);
    // process.env.NODE_ENV === 'development' ? sendDevError() : sendProductionError()
    if ( process.env.NODE_ENV === 'development'){
        sendDevError(error, res) 
    } else {
        // Before calling sendProduction Error that at first checks for operational
        // let's make some errors that we need to be operational to give meaningful
        // Error to the client as non operational one gives abstract
        let err = {...error}
        // err doesn't have name property, I don't know why
        if (error.name === 'CastError') {
            // for making the error operational
            err = handleCastError(error)
        }

        if (error.code === 11000) {
            err = handleDuplicateFieldsError(error)
        }

        if (error.name === 'ValidationError') {
            err = handleValidationError(error)
        }
        
        sendProductionError(err, res)
    }
}