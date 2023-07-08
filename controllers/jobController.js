const Job = require('../models/jobModel')
const ApiFeatures = require('../utils/apiFeatures')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')

// Note: When sending data in body we set the heading to json because the server can only parse the data
//  to body => req.body using Json.parse middleware only if the heading is set to json.

// When sending data to the browser or for example postman we use headin json so as the browser or postman can 
// know that it is json and display data based on that. And the most important case is when the client gets the
// data he must know the type of data so that he uses the matching parsing methods, if he didn't use an appropiate method
// he will get an error.

// async await: here what await does is not to implement the next lines until the current operation is resolved or rejected
// And here we use async with the function so as that the await doesn't stop the running code and only the lines we need to
// implement after the function is resolved or rejected by stopped


exports.getAllJobs = catchAsync(
    async (req, res) => {
    
        let query = Job.find({})
        const queryString = req.query

        // x + 1 will result in something went wrong as it is non operational
        // x + 1
        const apiFeatures = new ApiFeatures(query, queryString)
        apiFeatures
            .filter()
            .sort()
            .limitFields()
            .paginate()

        query = apiFeatures.query

        // pre find hook middleware will be executed beore this find query executed 
        // you will find that in GetAll
        const jobs = await query

        // RESPONSE
        res.status(200).json({
            status: 'success',
            results: jobs.length,
            data: {
                jobs
            }
        })
        
    }
)


exports.getJob = catchAsync(
    async (req, res, next) => {
        const id = req.params.id
        // An error coming from the next line won't have isOperational and will
        // be caught in catchAsync
        const job = await Job.findById(id)

        // note that no error will be resulted if didn't find the job to get or update
        // or delete
        if(!job) {
            // we say here return as without it the code will continue to execute
            // and then after that the global error will be called after finishing 
            // this function, which will result an error as we try to set headers
            // again into the global error
            return next(new AppError('No job found with that ID', 404))
        }

        res.status(200).json({
            status: 'success',
            data: {
                job
            }
        })
        console.log('hi after sending status')

    }
)

exports.createJob = catchAsync(
    async (req, res) => {

        const newJob = await Job.create(req.body)
        res.status(201).json({
            status: 'success',
            data: {
                job: newJob
            }
        })
    }
)

exports.updateJob = catchAsync(
    async (req, res, next) => {

        
        const id = req.params.id;
        const update = req.body
        const job = await Job.findByIdAndUpdate(id, update, {
            new: true,
            // To make sure to run validators, if we didn't run validators
            // data will be forced
            runValidators: true
        })

        // note that no error will be resulted if didn't find the job to get or update
        // or delete
        if(!job) {
            return next(new AppError('No job found with that ID', 404))
        }
    
        res.status(200).json({
            status: 'success',
            data: {
                job
            }
        })
    }
)

exports.deleteJob = catchAsync(
    async (req, res, next) => {
        const id = req.params.id
        const job = await Job.findByIdAndDelete(id)

        // note that no error will be resulted if didn't find the job to get or update
        // or delete
        if(!job) {
            return next(new AppError('No job found with that ID', 404))
        }

        res.status(204).json({
            status: 'success',
        })
    }
)

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

exports.getStats = catchAsync(
    async (req, res) => {
            // Expressions only provides additional features to queries
            const stats =   await Job.aggregate(
            [
                {
                    $match: {
                        $expr: {
                            $eq: [{$year: '$created_at'}, req.params.year * 1]
                        }
                    }
                },
        
                {
                    // allows expressions without 
                    $group: {
                        // For each document in the input collection, the $month 
                        // operator extracts the month from the created_at field, and 
                        // the resulting value is used as the grouping criterion for the $group
                        // stage. This means that all documents with the same month value will be
                        // grouped together in the output of the $group stage.

                        _id: {$month: '$created_at'},
                        numOfJobs: {$sum: 1},
                        // '$title' here means each value of document but title means the field
                        jobs: {$push: '$title'}
                    },

                },
                {
                    $addFields: {
                        // note that '$field' returns something as we need to assign the value
                        // of the id field to month but in project we don't need to 
                        // reference the value
                        month: '$_id'
                    }
                },

                {
                    // Despite of being able to use expression but we here want only to hide
                    // the field itself
                    $project: {_id: 0}
                },

                {
                    $sort: { month: -1 }
                },
                {
                    $limit: 2
                }
        
            ]
        )

        res.status(200).json({
            status: 'success',
            data:{
                stats
            }
        })

    }
)