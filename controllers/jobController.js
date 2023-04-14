const Job = require('../models/jobModel')
const ApiFeatures = require('../utils/ApiFeatures')

// Note: When sending data in body we set the heading to json because the server can only parse the data
//  to body => req.body using Json.parse middleware only if the heading is set to json.

// When sending data to the browser or for example postman we use headin json so as the browser or postman can 
// know that it is json and display data based on that. And the most important case is when the client gets the
// data he must know the type of data so that he uses the matching parsing methods, if he didn't use an appropiate method
// he will get an error.

// async await: here what await does is not to implement the next lines until the current operation is resolved or rejected
// And here we use async with the function so as that the await doesn't stop the running code and only the lines we need to
// implement after the function is resolved or rejected by stopped

exports.getAllJobs = async (req, res) => {
    
    try {
        let query = Job.find({})
        const queryString = req.query


        const apiFeatures = new ApiFeatures(query, queryString)
        apiFeatures
            .filter()
            .sort()
            .limitFields()
            .paginate()

        query = apiFeatures.query


        const jobs = await query

        // RESPONSE
        res.status(200).json({
            status: 'success',
            results: jobs.length,
            data: {
                jobs
            }
        })
        
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: error
        })
    }
}

exports.getJob = async (req, res) => {
    try {
        const id = req.params.id
        const job = await Job.findById(id)

        res.status(200).json({
            status: 'success',
            data: {
                job
            }
        })
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: error
        })
    }
}

exports.createJob = async (req, res) => {
    console.log(req.body)

    try {
        const newJob = await Job.create(req.body)
        res.status(201).json({
            status: 'success',
            data: {
                job: newJob
            }
        })
    }
    catch(error) {
        res.status(400).json({
            status: 'failed',
            message: error
        })
    }
}

exports.updateJob = async (req, res) => {
    try {
        const id = req.params.id;
        const update = req.body
        const job = await Job.findByIdAndUpdate(id, update, {
            new: true,
            runValidators: true
        })
    
        res.status(200).json({
            status: 'success',
            data: {
                job
            }
        })
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: error
        })
        
    }
}

exports.deleteJob = async (req, res) => {
    try {
        const id = req.params.id
        const job = await Job.findByIdAndDelete(id)

        res.status(204).json({
            status: 'success',
        })
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: error
        })
    }

}
// Alias
exports.lastFiveJobsAlias = (req, res, next) => {
    let queryObj = req.query
    queryObj.sort='-created_at'
    queryObj.limit='5'
    next()
}
// Alias
exports.lastFiveJobsAlias = (req, res, next) => {
    let queryObj = req.query
    queryObj.sort='-created_at'
    queryObj.limit='5'
    next()
}