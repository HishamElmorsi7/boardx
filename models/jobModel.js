const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'A job must have a title']
    },
    description: {
        type: String, 
        trim: true,
        required: [true, 'A job must have a description']
    },
    company: {
        type: String,
        trim: true,
        required: [true, 'A job must have a company']
    },
    company_website: {
        type: String
    },
    location: {
        type:String,
        trim: true,
        required: [true, 'A job must have a location']
    },
    Experience_level: {
        type: String,
        trim: true,
        required: [true, 'A job must have an experience level']
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    // full time or part time
    type: {
        type: String,
    }


})

const Job = mongoose.model('Job', jobSchema)

module.exports = Job