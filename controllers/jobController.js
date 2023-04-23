const Job = require('../models/jobModel')
const ApiFeatures = require('../utils/apiFeatures')

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

    try {
        const newJob = await Job.create(req.body)
        res.status(201).json({
            status: 'success',
            data: {
                job: newJob
            }
        })
    } catch(error) {
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
            // To make sure to run validators, if we didn't run validators
            // data will be forced
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

exports.getStats = async (req, res) => {
    try {
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
    } catch(error) {
        console.log(error)
        res.status(404).json({
            status: 'failed',
            message: error
        })
    }


}