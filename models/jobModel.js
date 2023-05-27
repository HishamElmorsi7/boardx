const mongoose = require('mongoose')
// for more validation to plugin within our mongoose 
const validator = require('validator')

// unique won't work when there is already duplicates in the DB
const jobSchema = new mongoose.Schema({
    title: {
        // To make it unique, I created an index with it from terminal
        // when I tried from here mongoose should have created index
        // but it didn't
        type: String,
        trim: true,
        required: [true, 'A job must have a title'],
        maxlength: [40, 'The title must be less than or equal to 40'],
        minlength: [4, 'The title must be greater than or equal to 4 '],
        // validate: {
        // custom validation function

        //     validator: function(value){
        //         return validator.equals(value, 'junior')
        //     },
        //     message: 'must be junior'
        // }
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
    experience_level: {
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
        // enum validator works only for string 
        enum: {
            values: ['full time', 'part time'],
            message: 'The type can only be full time or part time'
        }
    },
    slug: {
        type: String
    },

    secret_job: {
        type: Boolean,
        default: false
    },

    rating: {
        type: Number,
        // can work with dates
        min: [1, 'must be equal to or greater than 1'],
        max: [5, 'must be equal to or lower than 5'],
        // we can use the function then the message directly but for more readability we
        // did that here
        validate: {
            validator: function(val){
                // This here only pints to current document on new document creation
                // so it won't work with update and this.rating will be undefined 
                return this.rating > 2.5
            },

            // the curly braces here is related to mongoose not js to access value
            message: 'The value {VALUE} is not between 1 and 5'
        }
    }

}, {
    // toJSON: {virtuals: true},
    toObject: {virtuals: true}
})
// When using virtuals fields doesn't work for solving check chatgpt
jobSchema.virtual('yearCreated').get(function() {
    return this.created_at.getFullYear()
})
// let model = new UserModel();

// model.fullName = 'Thomas Anderson';

// console.log(model.toJSON()); // Output model fields as JSON
// console.log();
// console.log(model.fullName); // Output the full name

// DOCUMENT MIDDLEWARES
// note that the job may be not created if we didn't use next()
// jobSchema.pre('save', function(next){
//     this.slug = this.title + 'xe'
//     console.log(this)
//         next()

// })

// jobSchema.pre('save', function(next) {
//     console.log('Just before saved')
        // next()
// })

// jobSchema.pre('save', function(next) {
//     console.log('xx')
// })

// jobSchema.post('save', function(doc, next) {
//     console.log(doc)
//     next()
// })

// QUERY MIDDLEWARES

// This will work before the find executed
// note not before the find one that is behind the scenes of findById
// so we can use regual expression to run with any query starts with find
// jobSchema.pre(/^find/, function(next) {
    // this here refers to the query obj
//     this.find({secret_job: { $ne: true}})
//     this.timeStart = Date.now()
//     next()
// })

// jobSchema.post(/^find/, function(docs, next) {
//     console.log(docs)
//     console.log(Date.now()-this.timeStart)
//     next()
// })


// jobSchema.pre('aggregate', function(next) {
//     this.pipeline().unshift({$match: {secret_job: {$ne: true}}})
//     // returns the stages array
//     console.log(this.pipeline())
//     next()
// })

const Job = mongoose.model('Job', jobSchema)

module.exports = Job